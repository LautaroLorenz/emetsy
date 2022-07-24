import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotocellAdjustmentExecutionActionComponent } from './photocell-adjustment-execution-action.component';

describe('PhotocellAdjustmentExecutionActionComponent', () => {
  let component: PhotocellAdjustmentExecutionActionComponent;
  let fixture: ComponentFixture<PhotocellAdjustmentExecutionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotocellAdjustmentExecutionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotocellAdjustmentExecutionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
