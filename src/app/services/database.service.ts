import { Injectable, NgZone } from "@angular/core";
import { filter, from, map, Observable, Subject } from "rxjs";
import { RequestTableResponse } from "../models";
import { IpcService } from "./ipc.service";

@Injectable({
  providedIn: "root"
})
export class DatabaseService<T> {
  private readonly _getTableReply$ = new Subject<RequestTableResponse<T>>();
  private readonly _updateLocalTableData = (response: RequestTableResponse<T>) => {
    this._getTableReply$.next(response);
  };
  private readonly _getDatabaseTable = (tableName: string): void => {
    this.ipcService.send('get-table', { tableName });
  };
  private readonly _listenGetDatabaseTableReply = (ipcService: IpcService): void => {
    ipcService.on('get-table-reply', (_: any, args: any) => {
      this.ngZone.run(() => this._updateLocalTableData(args));
    });
  }
  private readonly _getTableDataAsObservable = (tableName: string): Observable<T[]> => (
    this._getTableReply$.pipe(
      filter(({ tableNameReply }) => tableNameReply === tableName),
      map(({ rows }) => (rows)),
    )
  );
  private _deleteRowFromDatabaseTable = (tableName: string, ids: any[]): Promise<number> => {
    return this.ipcService.invoke('delete-from-table', { tableName, ids });
  }
  private _addRowToTable = (tableName: string, element: T): Promise<number[]> => {
    return this.ipcService.invoke('add-to-table', { tableName, element });
  }
  private _editTableRow = (tableName: string, element: T): Promise<number> => {
    return this.ipcService.invoke('edit-from-table', { tableName, element });
  }

  constructor(
    private ipcService: IpcService,
    private ngZone: NgZone,
  ) {
    this._listenGetDatabaseTableReply(ipcService);
  }

  getTable(tableName: string): void {
    this._getDatabaseTable(tableName);
  }

  getTableReply$(tableName: string): Observable<T[]> {
    return this._getTableDataAsObservable(tableName);
  }

  deleteTableElements$(tableName: string, ids: any[]): Observable<number> {
    return from(this._deleteRowFromDatabaseTable(tableName, ids));
  }

  addElementToTable$(tableName: string, element: T): Observable<number> {
    return from(this._addRowToTable(tableName, element)).pipe(map(([newElementId]) => newElementId));
  }

  editElementFromTable$(tableName: string, element: T): Observable<number> {
    return from(this._editTableRow(tableName, element));
  }
}