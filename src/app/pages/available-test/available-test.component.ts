import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { filter, first, Observable, tap } from 'rxjs';
import { AbmPage, EssayTemplate, EssayTemplateDbTableContext, EssayTemplateTableColumns } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './available-test.component.html',
  styleUrls: ['./available-test.component.scss']
})
export class AvailableTestComponent extends AbmPage<EssayTemplate> implements OnInit {

  readonly title: string = 'Administración de ensayos disponibles';
  readonly haderIcon = PrimeIcons.BRIEFCASE;
  readonly cols = EssayTemplateTableColumns;
  readonly essayTemplates$: Observable<EssayTemplate[]>;

  constructor(
    private readonly dbService: DatabaseService<EssayTemplate>,
    private readonly messagesService: MessagesService,
  ) { 
    super(dbService, EssayTemplateDbTableContext);
    this.essayTemplates$ = this.refreshDataWhenDatabaseReply$(EssayTemplateDbTableContext.tableName);
  }

  ngOnInit(): void {
    this.requestTableDataFromDatabase(EssayTemplateDbTableContext.tableName);
  }

  deleteEssayTemplates(ids: string[] = []) {
    this.dbService.deleteTableElements$(EssayTemplateDbTableContext.tableName, ids)
      .pipe(
        first(),
        filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
        tap(() => {
          this.requestTableDataFromDatabase(EssayTemplateDbTableContext.tableName);
          this.messagesService.success('Eliminado correctamente');
        })
      ).subscribe({
        error: () => this.messagesService.error('Verifique que ningun elemento este en uso antes de eliminar')
      });
  }

}
