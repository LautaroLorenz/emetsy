import { Observable } from "rxjs";
import { DatabaseService } from "../services/database.service";

export class AbmPage<T> {
  private _dbService: DatabaseService<T>;

  constructor(dbService: DatabaseService<T>) {
    this._dbService = dbService;
  }

  protected refreshDataWhenDatabaseReply$(tableName: string): Observable<T[]> {
    return this._dbService.getTableReply$(tableName);
  }
  
  protected requestTableDataFromDatabase(tableName: string) {
    this._dbService.getTable(tableName);
  }
}