import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";

export interface Step extends DbForeignKey {
	id: number;
	name: string;
}

export const StepDbTableContext: DbTableContext = {
	tableName: 'steps',
	foreignTables: [],
};

export const StepTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Paso',
		sortable: true,
	},
];
