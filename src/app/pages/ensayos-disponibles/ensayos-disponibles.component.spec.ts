import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsayosDisponiblesComponent } from './ensayos-disponibles.component';

describe('EnsayosDisponiblesComponent', () => {
  let component: EnsayosDisponiblesComponent;
  let fixture: ComponentFixture<EnsayosDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnsayosDisponiblesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnsayosDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
