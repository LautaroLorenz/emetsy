import { AbmColum } from "../../components/abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";
import { EssayTemplateStep } from "./essay-template-step.model";


export interface HistoryItem {
  essayTemplateStep: EssayTemplateStep;
  reportData: any;
}

export interface History extends DbForeignKey {
  id: number;
  savedDate: string;
  essayName: string;
  items: HistoryItem[];
}

export const HistoryDbTableContext: DbTableContext = {
  tableName: 'history',
  foreignTables: [],
};

export const HistoryTableColumns: AbmColum[] = [];
