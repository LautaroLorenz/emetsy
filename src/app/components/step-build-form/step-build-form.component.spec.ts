import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBuildFormComponent } from './step-build-form.component';

describe('StepBuildFormComponent', () => {
  let component: StepBuildFormComponent;
  let fixture: ComponentFixture<StepBuildFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepBuildFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBuildFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
