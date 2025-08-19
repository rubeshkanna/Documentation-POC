import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RepoEntry {
  name: string;
  type: 'folder' | 'file';
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean; // <-- added for folder expand/collapse
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
    { name: 'src', type: 'folder' },
    { name: 'lib', type: 'folder' },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' }
  ];

  @Input() fileTree: FileNode[] = [];

  toggle(node: FileNode) {
    if (node.type === 'folder') {
      node.expanded = !node.expanded;
    }
  }

}
