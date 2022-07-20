import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepSwitchComponent } from './step-switch.component';

describe('StepSwitchComponent', () => {
  let component: StepSwitchComponent;
  let fixture: ComponentFixture<StepSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
