import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandResultComponent } from './stand-result.component';

describe('StandResultComponent', () => {
  let component: StandResultComponent;
  let fixture: ComponentFixture<StandResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
