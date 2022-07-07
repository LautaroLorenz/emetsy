import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillAvailableSpaceComponent } from './fill-available-space.component';

describe('FillAvailableSpaceComponent', () => {
  let component: FillAvailableSpaceComponent;
  let fixture: ComponentFixture<FillAvailableSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillAvailableSpaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillAvailableSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
