import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoPreview } from './repo-preview';

describe('RepoPreview', () => {
  let component: RepoPreview;
  let fixture: ComponentFixture<RepoPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
