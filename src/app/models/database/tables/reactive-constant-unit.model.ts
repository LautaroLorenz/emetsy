import { AbmColum } from "../../abm.model";
import { DbTableContext } from "../database.model";

export interface ReactiveConstantUnit {
	id: number;
	name: string;
};

export const ReactiveConstantUnitDbTableContext: DbTableContext = {
	tableName: 'reactive_constant_unit',
	foreignTables: [],
};

export const ReactiveConstantUnitTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre',
		sortable: true,
	},
];
