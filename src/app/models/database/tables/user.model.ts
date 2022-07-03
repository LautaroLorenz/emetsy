import { AbmColum } from "../../abm.model";
import { DbTableContext } from "../database.model";

export interface User {
	id: number;
	name: string;
	surname: string;
	identification: string;
}

export const UserDbTableContext: DbTableContext = {
	tableName: 'users',
	foreignTables: [],
};

export const UserTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre',
		sortable: true,
		styleClass: 'w-3'
	},
	{
		field: 'surname',
		header: 'Apellido',
		sortable: true,
		styleClass: 'w-3'
	},
	{
		field: 'identification',
		header: 'Identificación',
		sortable: true,
		styleClass: 'w-3'
	},
];
