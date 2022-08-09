import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { filter, first, Observable, tap } from 'rxjs';
import { AbmPage, History, HistoryDbTableContext, HistoryTableColumns } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './history-and-reports.component.html',
  styleUrls: ['./history-and-reports.component.scss']
})
export class HistoryAndReportsComponent extends AbmPage<History> implements OnInit {

  readonly title: string = 'Administración de historial y reportes';
  readonly haderIcon = PrimeIcons.BRIEFCASE;
  readonly cols = HistoryTableColumns;
  readonly history$: Observable<History[]>;

  constructor(
    private readonly dbService: DatabaseService<History>,
    private readonly messagesService: MessagesService,
  ) { 
    super(dbService, HistoryDbTableContext);
    this.history$ = this.refreshDataWhenDatabaseReply$(HistoryDbTableContext.tableName);
  }

  ngOnInit(): void {
    this.dbService.getTable(HistoryDbTableContext.tableName);
  }

  deleteHistory(ids: string[] = []) {
    this.dbService.deleteTableElements$(HistoryDbTableContext.tableName, ids)
      .pipe(
        first(),
        filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
        tap(() => {
          this.dbService.getTable(HistoryDbTableContext.tableName);
          this.messagesService.success('Eliminado correctamente');
        })
      ).subscribe({
        error: () => this.messagesService.error('Verifique que ningun elemento este en uso antes de eliminar')
      });
  }

}
