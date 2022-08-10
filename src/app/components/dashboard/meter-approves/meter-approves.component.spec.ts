import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterApprovesComponent } from './meter-approves.component';

describe('MeterApprovesComponent', () => {
  let component: MeterApprovesComponent;
  let fixture: ComponentFixture<MeterApprovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterApprovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeterApprovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
