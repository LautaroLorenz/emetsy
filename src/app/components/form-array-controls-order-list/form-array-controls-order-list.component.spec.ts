import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArrayControlsOrderListComponent } from './form-array-controls-order-list.component';

describe('FormArrayControlsOrderListComponent', () => {
  let component: FormArrayControlsOrderListComponent;
  let fixture: ComponentFixture<FormArrayControlsOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormArrayControlsOrderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormArrayControlsOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
