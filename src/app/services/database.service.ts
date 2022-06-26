import { Injectable, NgZone } from "@angular/core";
import { catchError, filter, from, map, Observable, Subject, throwError } from "rxjs";
import { RequestTableResponse, TableName } from "../models";
import { IpcService } from "./ipc.service";

@Injectable({
  providedIn: "root"
})
export class DatabaseService<T> {
  private readonly _getTableReply$ = new Subject<RequestTableResponse<T>>();
  private readonly _listenGetDatabaseTableReply = (ipcService: IpcService): void => {
    ipcService.on('get-table-reply', (_: any, args: any) => {
      this.ngZone.run(() => this._updateLocalTableData(args));
    });
  }
  private readonly _updateLocalTableData = (response: RequestTableResponse<T>) => {
    this._getTableReply$.next(response);
  };
  private readonly _getDatabaseTable = (tableName: TableName, relations: TableName[]): void => {
    this.ipcService.send('get-table', { tableName, relations });
  };
  private readonly _getTableDataAsObservable = (tableName: string): Observable<RequestTableResponse<T>> => (
    this._getTableReply$.pipe(
      filter(({ tableNameReply }) => tableNameReply === tableName)
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
  private _getTableRow = (tableName: string, id: number): Promise<T> => {
    return this.ipcService.invoke('get-table-row', { tableName, id });
  }

  constructor(
    private readonly ipcService: IpcService,
    private readonly ngZone: NgZone,
  ) {
    this._listenGetDatabaseTableReply(ipcService);
  }

  getTable(tableName: TableName, relations: TableName[]): void {
    this._getDatabaseTable(tableName, relations);
  }

  getTableReply$(tableName: string): Observable<RequestTableResponse<T>> {
    return this._getTableDataAsObservable(tableName);
  }

  getTableElement$(tableName: string, id: number): Observable<T> {
    return from(this._getTableRow(tableName, id));
  }

  deleteTableElements$(tableName: string, ids: any[]): Observable<number> {
    return from(this._deleteRowFromDatabaseTable(tableName, ids)).pipe(
      catchError((e) => {
        console.error(e.message); // TODO: almacenar en un log
        return throwError(() => new Error(e));
    }));
  }

  addElementToTable$(tableName: string, element: T): Observable<number> {
    return from(this._addRowToTable(tableName, element)).pipe(map(([newElementId]) => newElementId));
  }

  editElementFromTable$(tableName: string, element: T): Observable<number> {
    return from(this._editTableRow(tableName, element));
  }
}