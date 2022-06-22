import { AbmColum } from "./abm.model";
import { DbTableContext } from "./database.model";

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
		header: 'Nombre'
	},
	{
		field: 'surname',
		header: 'Apellido'
	},
	{
		field: 'identification',
		header: 'Identificación'
	}
];
