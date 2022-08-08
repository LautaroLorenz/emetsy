import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { History, HistoryDbTableContext, PageUrlName } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './see-report.component.html',
  styleUrls: ['./see-report.component.scss']
})
export class SeeReportComponent implements OnInit, OnDestroy {

  history$: BehaviorSubject<History | null> = new BehaviorSubject<History | null>(null);
  readonly title: string = 'Detalle de ejecución';
  readonly id$: Observable<number>;

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly navigationService: NavigationService,
    private readonly dbServiceHistory: DatabaseService<History>,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id),
    );
  }

  ngOnInit(): void {
    this.id$.pipe(
      takeUntil(this.destroyed$),
      switchMap((id) => this.dbServiceHistory.getTableElement$(HistoryDbTableContext.tableName, id)),
      tap((history) => history.items_raw = JSON.parse(history.items_raw as unknown as string)), // parse raw data
      tap((history) => this.history$.next(history)),
      // tap(({ id }) => this.requestTableEssayTemplateSteps(id)), //  TODO: build report
      tap(console.log) // TODO: quitar el log
    ).subscribe();
  }

  exit() {
    this.navigationService.back({ targetPage: PageUrlName.historyAndReports });
  };

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
