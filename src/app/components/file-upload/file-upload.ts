import { Component, EventEmitter, Output, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Output() filesChange = new EventEmitter<File[]>();

  constructor(private generatorService: GeneratorService) { }

  files = signal<File[]>([]);
  dragging = signal(false);

  get accept() {
    return '.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.go,.rb,.php,.md';
  }

  onBrowse(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.pushFiles(input.files);
      input.value = '';
    }
  }

  @HostListener('document:dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(evt: DragEvent) {
    evt.preventDefault(); this.dragging.set(true);
  }
  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault(); this.dragging.set(false);
  }
  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.dragging.set(false);
    if (evt.dataTransfer?.files?.length) this.pushFiles(evt.dataTransfer.files);
  }

  remove(i: number) {
    const copy = this.files().slice();
    copy.splice(i, 1);
    this.files.set(copy);
    this.filesChange.emit(this.files());
  }

  private pushFiles(fileList: FileList) {
    const allowed = Array.from(fileList).filter(f =>
      this.accept.split(',').some(ext => f.name.toLowerCase().endsWith(ext.replace('.', '')))
      || true // keep permissive: screenshots allow any; filter server-side in prod
    );
    const next = [...this.files(), ...allowed];
    this.files.set(next);
    this.filesChange.emit(next);
  }



  @Output() folderSelected = new EventEmitter<FileNode[]>();
  private selectedFiles: File[] = [];

  // Folders we want to skip entirely
  private excludedFolders = ['node_modules', '.angular', '.vscode', '.git'];

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    const validFiles = this.selectedFiles.filter(file=> {
      const pathParts = (file as any).webkitRelativePath.split('/');
      return !pathParts.some((part: any) => this.excludedFolders.includes(part));
    })
    const fileTree = this.buildFileTree(validFiles);
    this.folderSelected.emit(fileTree);

    this.uploadToBackend(validFiles);
  }

  uploadToBackend(files: File[]) {
    this.generatorService.uploadFiles(files).subscribe({
      next: event => {
        console.log(event)
      },
      error: err=> {
        console.log(err)
      },
      complete: () =>{
        console.log('upload done')
      }
    });
  }

  private buildFileTree(files: File[]): FileNode[] {
    const root: FileNode[] = [];

    files.forEach(file => {
      const pathParts = (file as any).webkitRelativePath.split('/');

      // Check if any part of the path is excluded
      if (pathParts.some((part: string) => this.excludedFolders.includes(part))) {
        return; // Skip this file
      }

      this.addToTree(root, pathParts);
    });

    return root;
  }

  private addToTree(tree: FileNode[], pathParts: string[]) {
    if (pathParts.length === 0) return;

    const [current, ...rest] = pathParts;
    let node = tree.find(n => n.name === current);

    if (!node) {
      node = {
        name: current,
        type: rest.length > 0 ? 'folder' : 'file',
        children: rest.length > 0 ? [] : undefined
      };
      tree.push(node);
    }

    if (rest.length > 0) {
      this.addToTree(node.children!, rest);
    }
  }
}
