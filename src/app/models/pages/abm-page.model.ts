import { map, Observable, tap } from "rxjs";
import { DatabaseService } from "../../services/database.service";
import { DbTableContext, TableRelationsMap } from "../database/database.model";
import { RelationsManager } from "../database/relations-manager.model";

export class AbmPage<T> {
  private readonly _dbService: DatabaseService<T>;
  private readonly _dbTableConnection: DbTableContext;
  protected _relations: TableRelationsMap = {};

  constructor(dbService: DatabaseService<T>, dbTableConnection: DbTableContext) {
    this._dbService = dbService;
    this._dbTableConnection = dbTableConnection;
  }

  private _setRelations(relations: TableRelationsMap): void {
    this._relations = { ...this._relations, ...relations };
  }

  protected refreshDataWhenDatabaseReply$(tableName: string): Observable<T[]> {
    return this._dbService.getTableReply$(tableName).pipe(
      tap(({ relations }) => this._setRelations(relations)),
      map(({ rows }) => (RelationsManager.mergeRelationsIntoRows<T>(rows, this._relations, this._dbTableConnection.foreignTables))),
    );
  }
}
