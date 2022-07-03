import { ForeignTable, TableRelationsMap } from "./database.model";

export class RelationsManager {
  static mergeRelationsIntoRows<T>(rows: T[], relations: TableRelationsMap, foreignTables: ForeignTable[]): T[] {
    if (Object.keys(relations).length === 0) {
      return rows;
    }
    if (foreignTables.length === 0) {
      return rows;
    }
    return rows.map((row: { [key: string]: any }) => {
      foreignTables.forEach(ft => {
        if (row[ft.foreignKey] !== undefined) {
          if (row['foreign'] === undefined) {
            row['foreign'] = {};
          }
          row['foreign'][ft.properyName] = relations[ft.tableName]?.find(value => value.id === row[ft.foreignKey]);
        }
      });

      return row;
    }) as T[];
  }
}
