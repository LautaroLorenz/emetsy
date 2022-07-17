import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotocellAdjustmentStepComponent } from './photocell-adjustment-step.component';

describe('PhotocellAdjustmentStepComponent', () => {
  let component: PhotocellAdjustmentStepComponent;
  let fixture: ComponentFixture<PhotocellAdjustmentStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotocellAdjustmentStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotocellAdjustmentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
