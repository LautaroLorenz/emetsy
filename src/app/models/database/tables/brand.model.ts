import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";

export interface Brand extends DbForeignKey {
	id: number;
	name: string;
	model: string;
	connection_id: number;
	foreign: {
	};
}

export const BrandDbTableContext: DbTableContext = {
	tableName: 'brands',
	foreignTables: [],
};

export const BrandTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Marca',
		sortable: true,
		styleClass: 'w-9'
	},
];
