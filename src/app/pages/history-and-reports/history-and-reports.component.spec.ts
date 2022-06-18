import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAndReportsComponent } from './history-and-reports.component';

describe('HistoryAndReportsComponent', () => {
  let component: HistoryAndReportsComponent;
  let fixture: ComponentFixture<HistoryAndReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryAndReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryAndReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
