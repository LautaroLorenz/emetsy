import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { catchError, filter, first, map, Observable, of, ReplaySubject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { EssayTemplate, EssayTemplateDbTableContext, PageUrlName, RelationsManager, Step, StepDbTableContext, WhereKind, WhereOperator } from 'src/app/models';
import { EssayTemplateStep, EssayTemplateStepDbTableContext } from 'src/app/models/database/tables/essay-template-step.model';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  templateUrl: './essay-template-builder.component.html',
  styleUrls: ['./essay-template-builder.component.scss']
})
export class EssayTemplateBuilderComponent implements OnInit, OnDestroy {

  readonly title: string = 'Ensayo';
  readonly id$: Observable<number>;
  readonly form: FormGroup;
  readonly confirmBeforeBackHeader: string = "Salir sin guardar";
  readonly confirmBeforeBackText: string = "¿Confirma qué quiere salir sin guardar?";
  readonly saveButtonMenuItems: MenuItem[] = [];
  readonly availableTestPageName = PageUrlName.availableTest;
  readonly steps$: Observable<Step[]>;

  essayTemplateId: number | undefined = undefined;
  nameInputFocused: boolean = false;

  get saveButtonDisabled(): boolean {
    return !this.form.valid || this.form.pristine;
  }
  get confirmBeforeBack(): boolean {
    return this.form.dirty;
  }

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly save$ = (): Observable<EssayTemplate> => {
    return of(this.form.valid).pipe(
      first(),
      filter((valid) => valid),
      map(() => this.form.get('essayTemplate')?.getRawValue()),
      map((essayTemplate) => ({
        ...essayTemplate,
        name: essayTemplate.name.toString().trim(),
      })),
      switchMap((essayTemplate) => {
        if (essayTemplate.id) {
          return this.dbService.editElementFromTable$(
            EssayTemplateDbTableContext.tableName,
            essayTemplate
          ).pipe(
            map(() => essayTemplate)
          );
        } else {
          return this.dbService.addElementToTable$(
            EssayTemplateDbTableContext.tableName,
            essayTemplate
          ).pipe(
            map((id) => ({ ...essayTemplate, id }))
          );
        }
      }),
      tap((essayTemplate) => {
        this.messagesService.success('Guardado correctamente');
        this.form.get('essayTemplate')?.reset(essayTemplate);
      }),
      catchError((e) => {
        this.messagesService.error('No se pudo guardar');
        return throwError(() => new Error(e));
      })
    )
  }
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
  private readonly requestToolsTables = (): void => {
    this.dbServiceSteps.getTable(
      StepDbTableContext.tableName,
      { relations: StepDbTableContext.foreignTables.map(ft => ft.tableName) }
    );
  }
  private readonly exit = () => this.navigationService.back({
    targetPage: PageUrlName.availableTest,
    withConfirmation: false,
  });
  private readonly saveAndExit = () => this.save$().pipe(
    first(),
    tap(() => this.exit())
  ).subscribe();
  private readonly saveAndCreate = () => this.save$().pipe(
    first(),
    tap(() => this.navigationService.go(PageUrlName.newEssayTemplate, { forceReload: true }))
  ).subscribe();
  private readonly saveAndExecute = () => this.save$().pipe(
    first(),
    tap(({ id }) => this.navigationService.go(PageUrlName.executeEssay, { queryParams: { id } }))
  ).subscribe();
  private readonly addEssaytemplateStepControl = (essayTemplateStep: Partial<EssayTemplateStep>): void => {
    this.getEssaytemplateStepControls().push(new FormControl(essayTemplateStep));
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dbService: DatabaseService<EssayTemplate>,
    private readonly dbServiceEssayTemplateStep: DatabaseService<EssayTemplateStep>,
    private readonly dbServiceSteps: DatabaseService<Step>,
    private readonly navigationService: NavigationService,
    private readonly messagesService: MessagesService,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id),
      tap((id) => this.essayTemplateId = id)
    );
    this.steps$ = this.dbServiceSteps.getTableReply$(StepDbTableContext.tableName).pipe(
      map((response) => RelationsManager.mergeRelationsIntoRows<Step>(
        response.rows,
        response.relations,
        StepDbTableContext.foreignTables
      ))
    );
    this.form = new FormGroup({
      essayTemplate: new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
      }),
      essayTemplateSteps: new FormArray([])
    });
    this.saveButtonMenuItems = [
      {
        label: 'Guardar y Salir',
        icon: PrimeIcons.SAVE,
        command: this.saveAndExit,
      },
      {
        label: 'Guardar y Ejecutar',
        icon: PrimeIcons.PLAY,
        command: this.saveAndExecute,
      },
      {
        label: 'Guardar y Crear otro',
        icon: PrimeIcons.PLUS,
        command: this.saveAndCreate,
      },
      { separator: true },
      {
        label: 'Salir sin guardar',
        icon: PrimeIcons.UNDO,
        command: this.exit,
      },
    ];
  }

  ngOnInit(): void {
    this.requestToolsTables();

    this.id$.pipe(
      takeUntil(this.destroyed$),
      switchMap((id) => this.dbService.getTableElement$(EssayTemplateDbTableContext.tableName, id)),
      tap((essayTemplate) => this.form.get('essayTemplate')?.patchValue(essayTemplate)),
      tap(({ id }) => this.requestTableEssayTemplateSteps(id)),
    ).subscribe();


    this.dbServiceEssayTemplateStep.getTableReply$(EssayTemplateStepDbTableContext.tableName).pipe(
      takeUntil(this.destroyed$),
      map(({ rows, relations }) => {
        const { foreignTables } = EssayTemplateStepDbTableContext;
        return RelationsManager.mergeRelationsIntoRows<EssayTemplateStep>(rows, relations, foreignTables);
      }),
      map((essayTemplateStep) => essayTemplateStep.sort((a, b) => a.order - b.order)),
      tap((essayTemplateSteps) => {
        essayTemplateSteps.forEach((essayTemplateStep: EssayTemplateStep) => this.addEssaytemplateStepControl(essayTemplateStep));
      })
    ).subscribe();
  }

  getEssaytemplateStepControls(): FormArray {
    return (this.form.get('essayTemplateSteps') as FormArray);
  }

  addEssayTemplateStep(step: Step): void {
    const newEssayTemplateStep: Partial<EssayTemplateStep> = {
      essay_template_id: this.essayTemplateId,
      step_id: step.id,
      foreign: {
        step
      }
    };
    this.addEssaytemplateStepControl(newEssayTemplateStep);
    this.form.markAsDirty();
  }

  save(): void {
    this.save$().subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
