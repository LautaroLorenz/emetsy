import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacuumTestParametersActionComponent } from './vacuum-test-parameters-action.component';

describe('VacuumTestParametersActionComponent', () => {
  let component: VacuumTestParametersActionComponent;
  let fixture: ComponentFixture<VacuumTestParametersActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacuumTestParametersActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacuumTestParametersActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
