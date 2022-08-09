import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { WhereKind, WhereOperator } from "../models";
import { Static, StaticDbTableContext } from "../models/database/tables/statics.model";
import { DatabaseService } from "./database.service";


@Injectable({
  providedIn: "root"
})
export class StaticsService {

  constructor(
    private readonly dbService: DatabaseService<Static>
  ) { }

  increment$(staticValue: Static): Observable<number> {
    const staicValueRaw: Static = {
      ...staticValue,
      tags_raw: JSON.stringify(staticValue.tags_raw ?? '{}') as any
    };
    return this.dbService.addElementToTable$(StaticDbTableContext.tableName, staicValueRaw);
  }

  getMetric$(metric: string): Observable<Static[]> {
    this.dbService.getTable(StaticDbTableContext.tableName, {
      conditions: [{
        kind: WhereKind.where,
        columnName: 'metric',
        operator: WhereOperator.equal,
        value: metric
      }]
    });
    return this.dbService.getTableReply$(StaticDbTableContext.tableName).pipe(
      map(({ rows }) => rows.map((row) => ({
        ...row,
        tags_raw: JSON.parse(row.tags_raw as unknown as string)
      })))
    );
  }
}
