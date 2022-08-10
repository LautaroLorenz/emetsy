import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { DateHelper, Metric, MetricEnum, Static } from 'src/app/models/index';
import { StaticsService } from 'src/app/services/statics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  readonly title: string = 'Panel de estadísticas';
  readonly fromDate: string;
  readonly fromTime: number;
  readonly toDate: string;
  readonly top: number = 5;

  readonly executions$ = new ReplaySubject<Static[]>(1);
  readonly meterApproves$ = new ReplaySubject<Static[]>(1);
  readonly standUsed$ = new ReplaySubject<Static[]>(1);

  constructor(
    private readonly staticsService: StaticsService,
  ) {
    this.fromDate = DateHelper.getLastMonth() + ' Hs';
    this.fromTime = DateHelper.getTime(DateHelper.getLastMonth());
    this.toDate = DateHelper.getNow() + ' Hs';
  }

  private loadMetric$(metric: Metric, rs: ReplaySubject<Static[]>): Observable<Static[]> {
    return this.staticsService.getMetric$(metric, this.fromTime).pipe(
      take(1),
      tap((value) => rs.next(value)),
    )
  }

  ngOnInit(): void {
    of(true).pipe(
      take(1),
      switchMap(() => this.loadMetric$(MetricEnum.execution, this.executions$)),
      switchMap(() => this.loadMetric$(MetricEnum.meterApproves, this.meterApproves$)),
      switchMap(() => this.loadMetric$(MetricEnum.standUsed, this.standUsed$)),
    ).subscribe();

  }
}
