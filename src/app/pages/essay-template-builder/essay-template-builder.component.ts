import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { EssayTemplate, EssayTemplateDbTableContext } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
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
  nameInputFocused: boolean = false;

  readonly back = () => this.navigationService.back({
    withConfirmation: this.form.dirty,
    confirmBeforeBackText: this.confirmBeforeBackText,
    confirmBeforeBackHeader: this.confirmBeforeBackHeader
  });

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dbService: DatabaseService<EssayTemplate>,
    private readonly navigationService: NavigationService,
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id)
    );
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
    });
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
