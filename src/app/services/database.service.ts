import { Injectable } from "@angular/core";
import { filter, map, Observable, Subject } from "rxjs";
import { RequestTableResponse } from "../models";
import { IpcService } from "./ipc.service";

@Injectable({
  providedIn: "root"
})
export class DatabaseService<T> {
  private readonly _getTableReply$ = new Subject<RequestTableResponse<T>>();
  private readonly updateLocalTableData = (response: RequestTableResponse<T>) => {
    this._getTableReply$.next(response);
  };
  private readonly requestTableToDatabase = (tableName: string): void => {
    this.ipcService.send('get-table', { tableName });
  };
  private readonly listenDatabaseTableResponses = (ipcService: IpcService): void => {
    ipcService.on('get-table-reply', (_: any, args: any) => {
      this.updateLocalTableData(args);
    });
  }
  private readonly getTableDataAsObservable = (tableName: string): Observable<T[]> => (
    this._getTableReply$.pipe(
      filter(({ tableNameReply }) => tableNameReply === tableName),
      map(({ rows }) => (rows)),
    )
  );

  constructor(private ipcService: IpcService) {
    this.listenDatabaseTableResponses(ipcService);
  }

  getTable(tableName: string): void {
    this.requestTableToDatabase(tableName);
  }
  getTableReply$(tableName: string): Observable<T[]> {
    return this.getTableDataAsObservable(tableName);
  }
}