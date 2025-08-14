import { Component, EventEmitter, Output, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss']
})
export class FileUpload {
  @Output() filesChange = new EventEmitter<File[]>();

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
}
