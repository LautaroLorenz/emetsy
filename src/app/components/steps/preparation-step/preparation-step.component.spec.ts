import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let component: PreparationStepComponent;
  let fixture: ComponentFixture<PreparationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparationStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
