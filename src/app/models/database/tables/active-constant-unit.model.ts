import { AbmColum } from "../../abm.model";
import { DbTableContext } from "../database.model";

export interface ActiveConstantUnit {
	id: number;
	name: string;
};

export const ActiveConstantUnitDbTableContext: DbTableContext = {
	tableName: 'active_constant_unit',
	foreignTables: [],
};

export const ActiveConstantUnitTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre',
		sortable: true,
	},
];
