import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootTestExecutionActionComponent } from './boot-test-execution-action.component';

describe('BootTestExecutionActionComponent', () => {
  let component: BootTestExecutionActionComponent;
  let fixture: ComponentFixture<BootTestExecutionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootTestExecutionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootTestExecutionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
