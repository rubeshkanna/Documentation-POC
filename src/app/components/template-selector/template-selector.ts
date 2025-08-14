import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateCard, TemplateTab } from '../../models/doc-types';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-selector.html',
  styleUrls: ['./template-selector.scss']
})
export class TemplateSelector {
  @Input() initialTab: TemplateTab = 'api-code';
  @Output() templatePicked = new EventEmitter<string>();

  tab = signal<TemplateTab>(this.initialTab);

  cards = signal<TemplateCard[]>([
    {
      id: 'api-reference',
      tab: 'api-code',
      title: 'API Reference',
      subtitle: 'Comprehensive API documentation with endpoints, parameters, and examples',
      bullets: ['Function signatures','Parameter details','Return types','Usage examples']
    }
    // You can add more cards to "guides" and "reference" to match future growth
  ]);

  filtered = computed(() => this.cards().filter(c => c.tab === this.tab()));
  pick(id: string){ this.templatePicked.emit(id); }
  setTab(t: TemplateTab){ this.tab.set(t); }
}
