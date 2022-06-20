import { AbmColum } from "./abm.model";

export interface User {
	id: number;
	name: string;
	surname: string;
	identification: string;
}

export const UserTableColums: AbmColum[] = [
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

export const UserTableName = 'users';