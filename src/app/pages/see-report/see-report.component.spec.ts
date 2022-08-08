import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeReportComponent } from './see-report.component';

describe('SeeReportComponent', () => {
  let component: SeeReportComponent;
  let fixture: ComponentFixture<SeeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
