import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from './components/file-upload/file-upload';
import { TemplateSelector } from './components/template-selector/template-selector';
import { RepoPreview } from './components/repo-preview/repo-preview';
import { GeneratorService } from './services/generator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileUpload, TemplateSelector, RepoPreview],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  repoStructure: any[] = [];
  repoFiles: File[] = [];
  docs: File[] = [];
  templateId = signal<string | null>(null);

  generating = signal<boolean>(false);
  progress = signal<number>(0);
  progressText = signal<string>('');

  canGenerate = computed(() =>
    !!this.repoFiles.length && !!this.templateId() && !this.generating()
  );

  constructor(private gen: GeneratorService) {}

  onFolderSelected(event: { tree: any[]; files: File[] }) {
    this.repoStructure = event.tree;
    this.repoFiles = event.files;
  }

  onDocsSelected(files: File[]) {
    this.docs = files;
  }

  onGenerate() {
    if (!this.canGenerate()) return;

    this.generating.set(true);
    this.progress.set(0);
    this.progressText.set('Starting…');

    this.gen.generate({
      files: this.repoFiles,
      docs: this.docs,
      templateId: this.templateId()!
    }).subscribe({
      next: s => {
        this.progress.set(s.percent);
        this.progressText.set(s.message);
      },
      complete: () => this.generating.set(false)
    });
  }
}
