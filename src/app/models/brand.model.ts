import { AbmColum } from "./abm.model";
import { DbForeignKey, DbTableContext } from "./database.model";
import { Connection, ConnectionDbTableContext } from "./connection.model";

export interface Brand extends DbForeignKey {
	id: number;
	name: string;
	model: string;
	connection_id: number;
	foreign: {
		connection: Connection,
	}
}

export const BrandDbTableContext: DbTableContext = {
	tableName: 'brands',
	foreignTables: [
		{
			tableName: ConnectionDbTableContext.tableName,
			foreignKey: 'connection_id',
			properyName: 'connection',
		}
	]
};

export const BrandTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Nombre'
	},
	{
		field: 'model',
		header: 'Modelo'
	},
	{
		field: 'foreign.connection.name',
		header: 'Conexión',
	}
];
