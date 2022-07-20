import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrastTestParametersActionComponent } from './contrast-test-parameters-action.component';

describe('ContrastTestParametersActionComponent', () => {
  let component: ContrastTestParametersActionComponent;
  let fixture: ComponentFixture<ContrastTestParametersActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContrastTestParametersActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrastTestParametersActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
