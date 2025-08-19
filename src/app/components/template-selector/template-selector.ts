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
      bullets: ['Function signatures', 'Parameter details', 'Return types', 'Usage examples']
    },
    {
      id: 'technical-documentation',
      tab: 'guides',
      title: 'Technical Documentation',
      subtitle: 'Detailed documentation explaining the system’s architecture, design, and implementation for developers and maintainers.',
      bullets:
        [
          "System architecture diagrams",
          "Code structure and module descriptions",
          "Technology stack details",
          "Setup and configuration steps",
          "Build and deployment instructions",
          "Integration points and dependencies",
          "Troubleshooting and debugging guidelines"
        ]

    },
    {
      id: 'business-reference',
      tab: 'reference',
      title: 'Business Reference',
      subtitle: 'High-level documentation aligning technical solutions with business objectives and processes.',
      bullets:
        [
          "Business goals and objectives",
          "Key use cases and workflows",
          "Stakeholder requirements",
          "KPIs and success metrics",
          "Compliance and regulatory considerations",
          "Impact analysis on business operations",
          "Process flow diagrams"
        ]

    }
    // You can add more cards to "guides" and "reference" to match future growth
  ]);

  selected = signal<string | null>(null);

  filtered = computed(() => this.cards().filter(c => c.tab === this.tab()));
  pick(id: string) { 
    this.selected.set(id);
    this.templatePicked.emit(id); 
  }
  setTab(t: TemplateTab) { this.tab.set(t); }
}
