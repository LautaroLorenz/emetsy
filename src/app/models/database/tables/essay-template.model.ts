import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";

export interface EssayTemplate extends DbForeignKey {
	id: number;
	name: string;
}

export const EssayTemplateDbTableContext: DbTableContext = {
	tableName: 'essay_templates',
	foreignTables: [],
};

export const EssayTemplateTableColumns: AbmColum[] = [
	{
		field: 'name',
		header: 'Ensayo',
		sortable: true,
	},
];
