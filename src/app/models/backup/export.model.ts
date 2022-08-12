import { BehaviorSubject } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { TableName } from "../database/database.model";

export interface ExportTable {
  tableName: TableName;
  tableReal: string;
  progress$: BehaviorSubject<number>;
  databaseService: DatabaseService<any>;
}


export interface ImportResult {
  imported: number;
  ignored: number;
}

export interface ImportTable extends ExportTable {
  result$: BehaviorSubject<ImportResult>;
}