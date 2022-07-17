import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotocellAdjustmentValuesActionComponent } from './photocell-adjustment-values-action.component';

describe('PhotocellAdjustmentValuesActionComponent', () => {
  let component: PhotocellAdjustmentValuesActionComponent;
  let fixture: ComponentFixture<PhotocellAdjustmentValuesActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotocellAdjustmentValuesActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotocellAdjustmentValuesActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
