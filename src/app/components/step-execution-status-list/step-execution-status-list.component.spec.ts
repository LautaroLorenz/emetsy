import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepExecutionStatusListComponent } from './step-execution-status-list.component';

describe('StepExecutionStatusListComponent', () => {
  let component: StepExecutionStatusListComponent;
  let fixture: ComponentFixture<StepExecutionStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepExecutionStatusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepExecutionStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
