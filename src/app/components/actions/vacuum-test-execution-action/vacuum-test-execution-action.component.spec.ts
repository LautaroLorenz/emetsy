import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacuumTestExecutionActionComponent } from './vacuum-test-execution-action.component';

describe('VacuumTestExecutionActionComponent', () => {
  let component: VacuumTestExecutionActionComponent;
  let fixture: ComponentFixture<VacuumTestExecutionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacuumTestExecutionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacuumTestExecutionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
