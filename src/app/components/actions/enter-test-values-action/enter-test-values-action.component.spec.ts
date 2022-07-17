import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterTestValuesActionComponent } from './enter-test-values-action.component';

describe('EnterTestValuesActionComponent', () => {
  let component: EnterTestValuesActionComponent;
  let fixture: ComponentFixture<EnterTestValuesActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterTestValuesActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterTestValuesActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
