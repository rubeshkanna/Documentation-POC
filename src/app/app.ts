import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from './components/file-upload/file-upload';
import { TemplateSelector } from './components/template-selector/template-selector';
import { GenerationSettings, Settings } from './components/generation-settings/generation-settings';
import { RepoPreview } from './components/repo-preview/repo-preview';
import { GeneratorService } from './services/generator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FileUpload,
    TemplateSelector,
    GenerationSettings,
    RepoPreview
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  files = signal<File[]>([]);
  templateId = signal<string | null>(null);
  settings = signal<Settings>({ includeExamples:true, includeTypes:true, detail:'detailed' });

  progressText = signal<string>('');        // UX status line
  progress = signal<number>(0);
  generating = signal<boolean>(false);

  canGenerate = computed(() => !!this.files().length && !!this.templateId() && !this.generating());

  constructor(private gen: GeneratorService){}

  onGenerate(){
    if (!this.canGenerate()) return;
    this.generating.set(true);
    this.progress.set(0); this.progressText.set('Starting…');

    this.gen.generate({
      files: this.files(),
      templateId: this.templateId()!,
      includeExamples: this.settings().includeExamples,
      includeTypes: this.settings().includeTypes,
      detail: this.settings().detail
    }).subscribe({
      next: s => { this.progress.set(s.percent); this.progressText.set(s.message); },
      complete: () => { this.generating.set(false); }
    });
  }
}
