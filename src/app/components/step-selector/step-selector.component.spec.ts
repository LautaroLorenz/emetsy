import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSelectorComponent } from './step-selector.component';

describe('StepSelectorComponent', () => {
  let component: StepSelectorComponent;
  let fixture: ComponentFixture<StepSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
