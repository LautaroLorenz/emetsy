import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSwitchListComponent } from './action-switch-list.component';

describe('ActionSwitchListComponent', () => {
  let component: ActionSwitchListComponent;
  let fixture: ComponentFixture<ActionSwitchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionSwitchListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionSwitchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
