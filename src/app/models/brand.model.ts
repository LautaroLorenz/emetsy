import { AbmColum } from "./abm.model";
import { Connection } from "./connection.model";
import { DbForeignKey } from "./database.model";

export interface Brand extends DbForeignKey {
	id: number;
	name: string;
	model: string;
	connection_id: number;
	foreign: {
		connection: Connection,
	}
}

export const BrandTableColums: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre'
	},
	{
		field: 'model',
		header: 'Modelo'
	},
	{
		field: 'connection_id',
		header: 'Conexión',
	}
];

export const BrandTableName = 'brands';