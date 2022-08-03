import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { Action, ContrastTestStep, EssayTemplate, EssayTemplateDbTableContext, ExecutionStatus, PageUrlName, PhotocellAdjustmentStep, PreparationStep, RelationsManager, ReportStep, StepBuilder, WhereKind, WhereOperator } from 'src/app/models';
import { EssayTemplateStep, EssayTemplateStepDbTableContext } from 'src/app/models/database/tables/essay-template-step.model';
import { DatabaseService } from 'src/app/services/database.service';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './execute-essay.component.html',
  styleUrls: ['./execute-essay.component.scss']
})
export class ExecuteEssayComponent implements OnInit, OnDestroy {

  readonly title: string = 'Ensayo';
  readonly id$: Observable<number>;
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

  private buildStepById(step_id: number, essayTemplateStep: EssayTemplateStep): StepBuilder {
    switch (step_id) {
      case 1:
        return new ReportStep(essayTemplateStep);
      case 4:
        return new ContrastTestStep(essayTemplateStep);
      case 6:
        return new PhotocellAdjustmentStep(essayTemplateStep);
      case 7:
        return new PreparationStep(essayTemplateStep, this.destroyed$);
    }

    return new StepBuilder(essayTemplateStep, [], []);
  }

  private buildSteps(essayTemplateSteps: EssayTemplateStep[]): void {
    this.stepBuilders = [];
    essayTemplateSteps.forEach((essayTemplateStep) => {
      const newStep: StepBuilder = this.buildStepById(essayTemplateStep.step_id, essayTemplateStep);
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
  }

  exit() {
    this.navigationService.back({ targetPage: PageUrlName.availableTest });
  };

  executeNext(): void {
    this.executionDirectorService.executeNext();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
