import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportActionComponent } from './report-action.component';

describe('ReportActionComponent', () => {
  let component: ReportActionComponent;
  let fixture: ComponentFixture<ReportActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
