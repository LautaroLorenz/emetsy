import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";
import { EssayTemplateStep } from "./essay-template-step.model";


export interface HistoryItem {
  essayTemplateStep: EssayTemplateStep;
  reportData: any;
}

export interface History extends DbForeignKey {
  id: number;
  saved: string;
  essay: string;
  items_raw: HistoryItem[];
}

export const HistoryDbTableContext: DbTableContext = {
  tableName: 'history',
  foreignTables: [],
};

export const HistoryTableColumns: AbmColum[] = [
  {
		field: 'essay',
		header: 'Nombre del ensayo',
		sortable: true,
	},
	{
		field: 'saved',
		header: 'Fecha de guardado',
		sortable: false,
    suffix: ' Hs'
	},
];
