import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIdentificationActionComponent } from './user-identification-action.component';

describe('UserIdentificationActionComponent', () => {
  let component: UserIdentificationActionComponent;
  let fixture: ComponentFixture<UserIdentificationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserIdentificationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIdentificationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
