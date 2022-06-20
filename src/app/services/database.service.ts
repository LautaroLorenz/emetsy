import { Injectable, NgZone } from "@angular/core";
import { filter, from, map, Observable, Subject } from "rxjs";
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
  private readonly getDatabaseTable = (tableName: string): void => {
    this.ipcService.send('get-table', { tableName });
  };
  private readonly listenGetDatabaseTableReply = (ipcService: IpcService): void => {
    ipcService.on('get-table-reply', (_: any, args: any) => {
      this.ngZone.run(() => this.updateLocalTableData(args));
    });
  }
  private readonly getTableDataAsObservable = (tableName: string): Observable<T[]> => (
    this._getTableReply$.pipe(
      filter(({ tableNameReply }) => tableNameReply === tableName),
      map(({ rows }) => (rows)),
    )
  );
  private deleteElementsFromDatabaseTable = (tableName: string, ids: any[]): Promise<number> => {
    return this.ipcService.invoke('delete-from-table', { tableName, ids });
  }

  constructor(
    private ipcService: IpcService,
    private ngZone: NgZone,
  ) {
    this.listenGetDatabaseTableReply(ipcService);
  }

  getTable(tableName: string): void {
    this.getDatabaseTable(tableName);
  }

  getTableReply$(tableName: string): Observable<T[]> {
    return this.getTableDataAsObservable(tableName);
  }

  deleteTableElements$(tableName: string, ids: any[]): Observable<number> {
    return from(this.deleteElementsFromDatabaseTable(tableName, ids));
  }
}