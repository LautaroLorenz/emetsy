import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingParametersStatusComponent } from './working-parameters-status.component';

describe('WorkingParametersStatusComponent', () => {
  let component: WorkingParametersStatusComponent;
  let fixture: ComponentFixture<WorkingParametersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingParametersStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingParametersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
