import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandIdentificationActionComponent } from './stand-identification-action.component';

describe('StandIdentificationActionComponent', () => {
  let component: StandIdentificationActionComponent;
  let fixture: ComponentFixture<StandIdentificationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandIdentificationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandIdentificationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
