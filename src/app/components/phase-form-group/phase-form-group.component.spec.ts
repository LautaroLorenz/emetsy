import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseFormGroupComponent } from './phase-form-group.component';

describe('PhaseFormGroupComponent', () => {
  let component: PhaseFormGroupComponent;
  let fixture: ComponentFixture<PhaseFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseFormGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
