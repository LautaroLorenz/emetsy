import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { EssayTemplate, EssayTemplateDbTableContext, PageUrlName, RelationsManager, WhereKind, WhereOperator } from 'src/app/models';
import { EssayTemplateStep, EssayTemplateStepDbTableContext } from 'src/app/models/database/tables/essay-template-step.model';
import { DatabaseService } from 'src/app/services/database.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './execute-essay.component.html',
  styleUrls: ['./execute-essay.component.scss']
})
export class ExecuteEssayComponent implements OnInit, OnDestroy {

  readonly title: string = 'Ensayo';
  readonly id$: Observable<number>;
  readonly form: FormGroup;

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

  constructor(
    private readonly dbServiceEssayTemplate: DatabaseService<EssayTemplate>,
    private readonly dbServiceEssayTemplateStep: DatabaseService<EssayTemplateStep>,
    private readonly navigationService: NavigationService,
    private readonly route: ActivatedRoute,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id)
    );
    this.form = new FormGroup({
      essayTemplate: new FormControl(),
      essayTemplateSteps: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.id$.pipe(
      takeUntil(this.destroyed$),
      switchMap((id) => this.dbServiceEssayTemplate.getTableElement$(EssayTemplateDbTableContext.tableName, id)),
      tap((essayTemplate) => this.form.get('essayTemplate')?.patchValue(essayTemplate)),
      tap(({ id }) => this.requestTableEssayTemplateSteps(id)),
      tap(console.log),
    ).subscribe();

    this.dbServiceEssayTemplateStep.getTableReply$(EssayTemplateStepDbTableContext.tableName).pipe(
      takeUntil(this.destroyed$),
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
      tap(() => console.log(this.form.getRawValue())),
    ).subscribe();
  }

  exit() {
    this.navigationService.back({ targetPage: PageUrlName.availableTest });
  };

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
