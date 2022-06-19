import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { IpcService } from "./ipc.service";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  constructor(private ipcService: IpcService) { }

  getTable<T>(tableName: string): Observable<T[]> {
    return of(this.ipcService.sendSync('get-' + tableName))
      .pipe(
        catchError((error: any) => throwError(() => new Error(error.json))),
        map((response: unknown) => (response as T[]))
      );
  }

  addElementToTable<T>(tableName: string, element: T): Observable<T[]> {
    return of(this.ipcService.sendSync('add-' + tableName, element))
    .pipe(
      catchError((error: any) => throwError(() => new Error(error.json))),
      map((response: unknown) => (response as T[]))
    );
  }

  deleteElementFromTable<T>(tableName: string, element: T): Observable<T[]> {
    return of(this.ipcService.sendSync('delete-' + tableName, element))
    .pipe(
      catchError((error: any) => throwError(() => new Error(error.json))),
      map((response: unknown) => (response as T[]))
    );
  }
}