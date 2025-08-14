import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailLevel } from '../../models/doc-types';
import { FormsModule } from '@angular/forms';

export interface Settings {
  includeExamples: boolean;
  includeTypes: boolean;
  detail: DetailLevel;
}

@Component({
  selector: 'app-generation-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generation-settings.html',
  styleUrls: ['./generation-settings.scss']
})
export class GenerationSettings {
  @Input() value: Settings = { includeExamples: true, includeTypes: true, detail:'detailed' };
  @Output() valueChange = new EventEmitter<Settings>();

  setDetail(d: DetailLevel){
    this.value = {...this.value, detail: d};
    this.valueChange.emit(this.value);
  }
  toggle(key: 'includeExamples'|'includeTypes'){
    this.value = {...this.value, [key]: !this.value[key]};
    this.valueChange.emit(this.value);
  }
}
