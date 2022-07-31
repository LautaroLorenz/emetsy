import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrastTestExecutionActionComponent } from './contrast-test-execution-action.component';

describe('ContrastTestExecutionActionComponent', () => {
  let component: ContrastTestExecutionActionComponent;
  let fixture: ComponentFixture<ContrastTestExecutionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContrastTestExecutionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrastTestExecutionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
