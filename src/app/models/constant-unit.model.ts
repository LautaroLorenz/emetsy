import { AbmColum } from "./abm.model";
import { DbTableContext } from "./database.model";

export interface ConstantUnit {
	id: number;
	name: string;
};

export const ConstantUnitDbTableContext: DbTableContext = {
	tableName: 'constant_unit',
	foreignTables: []
};

export const ConstantUnitTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre',
		sortable: true,
	}
];
