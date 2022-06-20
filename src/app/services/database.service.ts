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
  private deleteRowFromDatabaseTable = (tableName: string, ids: any[]): Promise<number> => {
    return this.ipcService.invoke('delete-from-table', { tableName, ids });
  }
  private addRowToTable = (tableName: string, element: T): Promise<number[]> => {
    return this.ipcService.invoke('add-to-table', { tableName, element });
  }
  private editTableRow = (tableName: string, element: T): Promise<number> => {
    return this.ipcService.invoke('edit-from-table', { tableName, element });
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
    return from(this.deleteRowFromDatabaseTable(tableName, ids));
  }

  addElementToTable$(tableName: string, element: T): Observable<number> {
    return from(this.addRowToTable(tableName, element)).pipe(map(([newElementId]) => newElementId));
  }

  editElementFromTable$(tableName: string, element: T): Observable<number> {
    return from(this.editTableRow(tableName, element));
  }
}