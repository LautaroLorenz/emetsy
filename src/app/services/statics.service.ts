import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { WhereKind, WhereOperator } from "../models";
import { Static, StaticDbTableContext, Tags } from "../models/database/tables/statics.model";
import { DatabaseService } from "./database.service";


@Injectable({
  providedIn: "root"
})
export class StaticsService {

  constructor(
    private readonly dbService: DatabaseService<Static>
  ) { }

  increment$(metric: string, tags?: Tags): Observable<number> {
    const staticValue: Static = {
      saved_time: (new Date()).getTime(),
      metric,
      tags_raw: JSON.stringify(tags ?? '{}') as any
    } as any;
    return this.dbService.addElementToTable$(StaticDbTableContext.tableName, staticValue);
  }

  getMetric$(metricValue: string, from: number): Observable<Static[]> {
    this.dbService.getTable(StaticDbTableContext.tableName, {
      conditions: [{
        kind: WhereKind.where,
        columnName: 'metric',
        operator: WhereOperator.equal,
        value: metricValue
      }, {
        kind: WhereKind.andWhere,
        columnName: 'saved_time',
        operator: WhereOperator.major,
        value: from
      }]
    });
    return this.dbService.getTableReply$(StaticDbTableContext.tableName).pipe(
      map(({ rows }) => rows.filter(({ metric }) => metric === metricValue)),
      map((rows) => rows.map((row) => ({
        ...row,
        tags_raw: JSON.parse(row.tags_raw as unknown as string)
      })))
    );
  }
}
