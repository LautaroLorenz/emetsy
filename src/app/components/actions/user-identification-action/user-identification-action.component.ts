import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, ReplaySubject, takeUntil, tap } from 'rxjs';
import { Action, ActionComponent, User, UserDbTableContext, UserIdentificationAction } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-user-identification-action',
  templateUrl: './user-identification-action.component.html',
  styleUrls: ['./user-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIdentificationActionComponent implements ActionComponent, AfterViewInit, OnDestroy {

  dropdownUserOptions: User[] = [];

  @Input() action!: Action;

  get name(): string {
    return this.action.name;
  }

  get form(): FormGroup {
    return this.action.form;
  }

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  private readonly lisenRequestReplyDropdownOptions = (): void => {
    this.dbServiceUsers.getTableReply$(UserDbTableContext.tableName).pipe(
      takeUntil(this.destroyed$),
      map(({ rows }) => rows),
      map((rows) => (rows.map(x => ({
        ...x,
        label: `${x.surname} - ${x.name} - ${x.identification}`
      })))),
      map((rows) => (rows.sort(
        (a, b) => a.label.localeCompare(b.label)
      ))),
      tap((rows) => this.dropdownUserOptions = rows),
      tap(() => this.form.updateValueAndValidity({ emitEvent: true })),
      tap(() => this.changeDetectorRef.detectChanges()),
    ).subscribe();

    this.action.form.get('userId')?.valueChanges.pipe(
      takeUntil(this.destroyed$),
      tap((userId) => (this.action as UserIdentificationAction).selectedUser = this.dropdownUserOptions.find((user) => user.id === userId)),
    ).subscribe();
  }

  private requestDropdownOptions = (): void => {
    this.dbServiceUsers.getTable(UserDbTableContext.tableName);
  }

  constructor(
    private readonly dbServiceUsers: DatabaseService<User>,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.lisenRequestReplyDropdownOptions();
    this.requestDropdownOptions();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
