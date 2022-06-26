import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayTemplateBuilderComponent } from './essay-template-builder.component';

describe('EssayTemplateBuilderComponent', () => {
  let component: EssayTemplateBuilderComponent;
  let fixture: ComponentFixture<EssayTemplateBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssayTemplateBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EssayTemplateBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
