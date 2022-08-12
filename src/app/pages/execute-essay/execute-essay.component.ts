import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, ReplaySubject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Action, DateHelper, EssayTemplate, EssayTemplateDbTableContext, EssayTemplateStep, EssayTemplateStepDbTableContext, ExecutionStatus, History, HistoryDbTableContext, HistoryItem, MetricEnum, PageUrlName, RelationsManager, StepBuilder, WhereKind, WhereOperator } from 'src/app/models';
import { StepConstructor } from 'src/app/models/steps/step-constructor.model';
import { DatabaseService } from 'src/app/services/database.service';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { MessagesService } from 'src/app/services/messages.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { StaticsService } from 'src/app/services/statics.service';

@Component({
  templateUrl: './execute-essay.component.html',
  styleUrls: ['./execute-essay.component.scss']
})
export class ExecuteEssayComponent implements OnInit, OnDestroy {

  readonly title: string = 'Ensayo';
  readonly id$: Observable<number>;
  readonly saving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly form: FormGroup;

  showNoStepsWarning!: boolean;
  stepBuilders: StepBuilder[] = [];

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly requestTableEssayTemplateSteps = (essayTemplateId: number): void => {
    const { foreignTables } = EssayTemplateStepDbTableContext;
    const { tableName: essayTemplateTableName } = EssayTemplateDbTableContext;
    const foreignTablesFiltered = foreignTables.filter(ft => ft.tableName !== essayTemplateTableName);
    const foreignTableNames = foreignTablesFiltered.map(ft => ft.tableName);
    const getTableOptions = {
      relations: foreignTableNames,
      conditions: [{
        kind: WhereKind.where,
        columnName: 'essay_template_id',
        operator: WhereOperator.equal,
        value: essayTemplateId
      }]
    };
    this.dbServiceEssayTemplateStep.getTable(
      EssayTemplateStepDbTableContext.tableName,
      getTableOptions,
    );
  }
  get essayName(): string {
    return this.form.get('essayTemplate')?.value?.name;
  }
  get stepControls(): FormArray<FormControl> {
    return (this.form.get('essayTemplateSteps') as FormArray);
  }
  get activeAction$(): Observable<Action | null> {
    return this.executionDirectorService.activeAction$;
  }
  get activeStepIndex$(): Observable<number | null> {
    return this.executionDirectorService.activeStepIndex$;
  }
  get activeActionIndex$(): Observable<number | null> {
    return this.executionDirectorService.activeActionIndex$;
  }
  get executionStatus$(): Observable<ExecutionStatus> {
    return this.executionDirectorService.executionStatus$;
  }

  constructor(
    private readonly dbServiceEssayTemplate: DatabaseService<EssayTemplate>,
    private readonly dbServiceEssayTemplateStep: DatabaseService<EssayTemplateStep>,
    private readonly navigationService: NavigationService,
    private readonly route: ActivatedRoute,
    private readonly executionDirectorService: ExecutionDirector,
    private readonly dbServiceHistory: DatabaseService<History>,
    private readonly messagesService: MessagesService,
    private readonly staticsService: StaticsService,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id),
      tap(() => executionDirectorService.resetState()),
      tap(() => this.showNoStepsWarning = false),
    );
    this.form = new FormGroup({
      essayTemplate: new FormControl(),
      essayTemplateSteps: new FormArray([])
    });
  }

  private buildSteps(essayTemplateSteps: EssayTemplateStep[]): void {
    this.stepBuilders = [];
    essayTemplateSteps.forEach((essayTemplateStep) => {
      const newStep: StepBuilder = StepConstructor.buildStepById(essayTemplateStep.step_id, essayTemplateStep, this.destroyed$);
      newStep.buildStepForm();
      newStep.form.patchValue(essayTemplateStep.actions_raw_data);
      this.stepBuilders.push(newStep);
    });
  }

  private initExecution(): void {
    this.executionDirectorService.setSteps(this.stepBuilders);
    this.executionDirectorService.prepareStepsToExecute();
    this.executionDirectorService.executeNext();
  }

  ngOnInit(): void {
    this.id$.pipe(
      takeUntil(this.destroyed$),
      switchMap((id) => this.dbServiceEssayTemplate.getTableElement$(EssayTemplateDbTableContext.tableName, id)),
      tap((essayTemplate) => this.form.get('essayTemplate')?.patchValue(essayTemplate)),
      tap(({ id }) => this.requestTableEssayTemplateSteps(id)),
    ).subscribe();

    this.dbServiceEssayTemplateStep.getTableReply$(EssayTemplateStepDbTableContext.tableName).pipe(
      takeUntil(this.destroyed$),
      tap(({ rows }) => {
        if (rows.length === 0) {
          this.showNoStepsWarning = true;
        }
      }),
      map(({ rows, relations }) => {
        const { foreignTables } = EssayTemplateStepDbTableContext;
        return RelationsManager.mergeRelationsIntoRows<EssayTemplateStep>(rows, relations, foreignTables);
      }),
      map((essayTemplateStep) => essayTemplateStep.sort((a, b) => a.order - b.order)),
      tap((essayTemplateSteps) => essayTemplateSteps.forEach((essayTemplateStep: EssayTemplateStep) => {
        this.stepControls.push(new FormControl({
          ...essayTemplateStep,
          actions_raw_data: JSON.parse(essayTemplateStep?.actions_raw_data?.toString() || '[]')
        }));
      })),
      tap(() => this.buildSteps(this.form.get('essayTemplateSteps')?.getRawValue())),
      tap(() => this.initExecution()),
    ).subscribe();

    this.executionStatus$.pipe(
      takeUntil(this.destroyed$),
      filter(status => status === 'COMPLETED'),
    ).subscribe();
  }

  exit() {
    this.navigationService.back({ targetPage: PageUrlName.availableTest });
  };

  executeNext(): void {
    this.executionDirectorService.executeNext();
  }

  save(): void {
    this.saving$.next(true);

    const history: History = {
      essay: this.essayName,
      saved: DateHelper.getNow(),
    } as History;
    history.items_raw = [];
    this.stepBuilders.forEach((stepBuilder) => {
      const historyItem: HistoryItem = {
        essayTemplateStep: stepBuilder.essayTemplateStep,
        reportData: stepBuilder.reportBuilder.data
      };
      history.items_raw.push(historyItem);
    });

    this.dbServiceHistory.addElementToTable$(HistoryDbTableContext.tableName, {
      ...history,
      items_raw: JSON.stringify(history.items_raw) as any,
    })
      .pipe(
        take(1),
        tap(() => {
          this.staticsService.increment$(MetricEnum.execution, { essay: this.essayName }).pipe(take(1)).subscribe();
          this.messagesService.success('Agregado correctamente');
          this.navigationService.back({ targetPage: PageUrlName.historyAndReports });
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo crear el elemento')
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
