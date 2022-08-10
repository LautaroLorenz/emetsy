import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandUsedComponent } from './stand-used.component';

describe('StandUsedComponent', () => {
  let component: StandUsedComponent;
  let fixture: ComponentFixture<StandUsedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandUsedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
