import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootTestParametersActionComponent } from './boot-test-parameters-action.component';

describe('BootTestParametersActionComponent', () => {
  let component: BootTestParametersActionComponent;
  let fixture: ComponentFixture<BootTestParametersActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootTestParametersActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootTestParametersActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
