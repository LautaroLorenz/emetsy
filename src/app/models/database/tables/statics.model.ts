import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";

export type Tags = Record<string, string> | string[];

export interface Static extends DbForeignKey {
	id: number;
	saved_time: number;
	metric: string;
  tags_raw: Tags;
}

export const StaticDbTableContext: DbTableContext = {
	tableName: 'statics',
	foreignTables: [],
};

export const StaticTableColumns: AbmColum[] = [];
