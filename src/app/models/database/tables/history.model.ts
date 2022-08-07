import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";
import { EssayTemplateStep } from "./essay-template-step.model";


export interface HistoryItem {
  essayTemplateStep: EssayTemplateStep;
  report_raw_data: any;
}

export interface History extends DbForeignKey {
  id: number;
  items: HistoryItem[];
}

export const HistoryDbTableContext: DbTableContext = {
  tableName: 'history',
  foreignTables: [],
};

export const HistoryTableColumns: AbmColum[] = [];
