import { Component, EventEmitter, Output, signal, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorService } from '../../services/generator';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss']
})
export class FileUpload {
  @Input() mode: 'folder' | 'docs' = 'folder';
  @Output() folderSelected = new EventEmitter<{ tree: FileNode[]; files: File[] }>();
  @Output() docsSelected = new EventEmitter<File[]>();

  files = signal<File[]>([]);
  dragging = signal(false);

  private excludedFolders = ['node_modules', '.git', '.vscode', '.angular'];

  constructor(private generatorService: GeneratorService) { }

  @HostListener('document:dragover', ['$event']) onDragOver(evt: DragEvent) { evt.preventDefault(); }
  @HostListener('dragenter', ['$event']) onDragEnter(evt: DragEvent) { evt.preventDefault(); this.dragging.set(true); }
  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) { evt.preventDefault(); this.dragging.set(false); }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.dragging.set(false);
    if (evt.dataTransfer?.files?.length) this.onFilesSelected({ target: { files: evt.dataTransfer.files } });
  }

onFilesSelected(event: any) {
  const selectedFiles: File[] = Array.from(event.target.files as FileList);

  if (this.mode === 'folder') {
    const validFiles: File[] = selectedFiles.filter(file => {
      const pathParts = (file as any).webkitRelativePath?.split('/') || [];
      return !pathParts.some((p:any) => this.excludedFolders.includes(p));
    });

    const fileTree = this.buildFileTree(validFiles);
    this.folderSelected.emit({ tree: fileTree, files: validFiles });
  } 
  else if (this.mode === 'docs') {
    const validDocs: File[] = selectedFiles.filter(file =>
      file.name.endsWith('.docx') || file.name.endsWith('.md') || file.name.endsWith('.txt')
    );
    this.docsSelected.emit(validDocs);
  }
}


  private buildFileTree(files: File[]): FileNode[] {
    const root: FileNode[] = [];
    files.forEach(file => {
      const pathParts = (file as any).webkitRelativePath.split('/');
      this.addToTree(root, pathParts);
    });
    return root;
  }

  private addToTree(tree: FileNode[], pathParts: string[]) {
    if (!pathParts.length) return;
    const [current, ...rest] = pathParts;
    let node = tree.find(n => n.name === current);
    if (!node) {
      node = { name: current, type: rest.length ? 'folder' : 'file', children: rest.length ? [] : undefined };
      tree.push(node);
    }
    if (rest.length) this.addToTree(node.children!, rest);
  }
}
