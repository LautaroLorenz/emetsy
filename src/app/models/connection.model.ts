import { AbmColum } from "./abm.model";

export interface Connection {
	id: number;
	name: string;
};

export const ConnectionTableColums: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre'
	},
];

export const ConnectionTableName = 'connections';
