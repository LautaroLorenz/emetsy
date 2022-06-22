import { map, Observable, tap } from "rxjs";
import { DatabaseService } from "../services/database.service";
import { DbTableContext, ForeignTable, TableName, TableRelationsMap } from "./database.model";

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

  private _mergeRelationsIntoRows(rows: T[], relations: TableRelationsMap, foreignTables: ForeignTable[]): T[] {
    if (Object.keys(relations).length === 0) {
      return rows;
    }
    if(foreignTables.length === 0) {
      return rows;
    }
    return rows.flatMap((row: { [key: string]: any }) => foreignTables.map(ft => {
      if(row[ft.foreignKey] !== undefined) {
        if(row['foreign'] === undefined) {
          row['foreign'] = {};
        }
        row['foreign'][ft.properyName] = relations[ft.tableName].find(value => value.id === row[ft.foreignKey]);
      }
      return row;
    })) as T[];
  }

  protected requestTableDataFromDatabase(tableName: string, relations: TableName[] = []): void {
    this._dbService.getTable(tableName, relations);
  }

  protected refreshDataWhenDatabaseReply$(tableName: string): Observable<T[]> {
    return this._dbService.getTableReply$(tableName).pipe(
      tap(({ relations }) => this._setRelations(relations)),
      map(({ rows }) => (this._mergeRelationsIntoRows(rows, this._relations, this._dbTableConnection.foreignTables)))
    );
  }
}
