export type TemplateTab = 'api-code' | 'guides' | 'reference';
export type DetailLevel = 'concise' | 'detailed' | 'complete';

export interface TemplateCard {
  id: string;
  tab: TemplateTab;
  title: string;
  subtitle: string;
  bullets: string[];
}
