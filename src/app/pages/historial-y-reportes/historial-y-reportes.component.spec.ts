import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialYReportesComponent } from './historial-y-reportes.component';

describe('HistorialYReportesComponent', () => {
  let component: HistorialYReportesComponent;
  let fixture: ComponentFixture<HistorialYReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialYReportesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialYReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
