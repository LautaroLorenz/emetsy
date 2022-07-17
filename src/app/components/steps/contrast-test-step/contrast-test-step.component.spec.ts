import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrastTestStepComponent } from './contrast-test-step.component';

describe('ContrastTestStepComponent', () => {
  let component: ContrastTestStepComponent;
  let fixture: ComponentFixture<ContrastTestStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContrastTestStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrastTestStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
