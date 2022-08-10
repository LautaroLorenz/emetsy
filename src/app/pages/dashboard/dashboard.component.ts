import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReplaySubject, take, tap } from 'rxjs';
import { DateHelper, MetricEnum, Static } from 'src/app/models/index';
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
  readonly top: number = 3;

  readonly executions$ = new ReplaySubject<Static[]>(1);

  constructor(
    private readonly staticsService: StaticsService,
  ) {
    this.fromDate = DateHelper.getLastMonth() + ' Hs';
    this.fromTime = DateHelper.getTime(DateHelper.getLastMonth());
    this.toDate = DateHelper.getNow() + ' Hs';
  }

  ngOnInit(): void {
    this.staticsService.getMetric$(MetricEnum.execution, this.fromTime).pipe(
      take(1),
      tap((value) => this.executions$.next(value)),
    ).subscribe();
  }
}
