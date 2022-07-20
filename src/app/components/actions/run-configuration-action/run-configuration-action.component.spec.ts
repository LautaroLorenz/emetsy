import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunConfigurationActionComponent } from './run-configuration-action.component';

describe('RunConfigurationActionComponent', () => {
  let component: RunConfigurationActionComponent;
  let fixture: ComponentFixture<RunConfigurationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunConfigurationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunConfigurationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
