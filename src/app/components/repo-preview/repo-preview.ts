import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RepoEntry {
  name: string;
  type: 'folder'|'file';
}

@Component({
  selector: 'app-repo-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repo-preview.html',
  styleUrls: ['./repo-preview.scss']
})
export class RepoPreview {
  @Input() entries: RepoEntry[] = [
    {name:'src', type:'folder'},
    {name:'lib', type:'folder'},
    {name:'package.json', type:'file'},
    {name:'README.md', type:'file'}
  ];
}
