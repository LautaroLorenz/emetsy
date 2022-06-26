import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { catchError, filter, first, map, Observable, of, ReplaySubject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { EssayTemplate, EssayTemplateDbTableContext, PageUrlName } from 'src/app/models';
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

  nameInputFocused: boolean = false;

  readonly back = () => this.navigationService.back({
    targetPage: PageUrlName.availableTest,
    withConfirmation: this.form.dirty,
    confirmBeforeBackText: this.confirmBeforeBackText,
    confirmBeforeBackHeader: this.confirmBeforeBackHeader
  });

  private readonly save$ = (): Observable<EssayTemplate> => {
    return of(this.form.valid).pipe(
      first(),
      filter((valid) => valid),
      map(() => this.form.getRawValue()),
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
        this.form.reset(essayTemplate);
      }),
      catchError((e) => {
        this.messagesService.error('No se pudo guardar');
        return throwError(() => new Error(e));
      })
    )
  }
  private readonly exit = () => this.navigationService.back({
    targetPage: PageUrlName.availableTest,
    withConfirmation: false,
  });
  private readonly saveAndExit = () => this.save$().pipe(
    tap(() => this.exit())
  ).subscribe();
  private readonly saveAndCreate = () => this.save$().pipe(
    tap(() => this.navigationService.go(PageUrlName.newEssayTemplate, { forceReload: true }))
  ).subscribe();
  private readonly saveAndExecute = () => this.save$().pipe(
    tap(() => this.navigationService.go(PageUrlName.executeEssay))
  ).subscribe();

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dbService: DatabaseService<EssayTemplate>,
    private readonly navigationService: NavigationService,
    private readonly messagesService: MessagesService,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id)
    );
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
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

  save() {
    this.save$().subscribe();
  }

  ngOnInit(): void {
    this.id$.pipe(
      takeUntil(this.destroyed$),
      switchMap((id) => this.dbService.getTableElement$(EssayTemplateDbTableContext.tableName, id)),
      tap((essayTemplate) => this.form.patchValue(essayTemplate))
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
