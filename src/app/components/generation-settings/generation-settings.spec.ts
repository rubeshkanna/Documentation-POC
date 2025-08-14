import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationSettings } from './generation-settings';

describe('GenerationSettings', () => {
  let component: GenerationSettings;
  let fixture: ComponentFixture<GenerationSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
