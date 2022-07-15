import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterIdentificationActionComponent } from './meter-identification-action.component';

describe('MeterIdentificationActionComponent', () => {
  let component: MeterIdentificationActionComponent;
  let fixture: ComponentFixture<MeterIdentificationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterIdentificationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterIdentificationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
