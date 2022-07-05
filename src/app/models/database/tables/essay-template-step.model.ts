import { AbmColum } from "../../abm.model";
import { DbForeignKey, DbTableContext } from "../database.model";
import { EssayTemplate, EssayTemplateDbTableContext } from "./essay-template.model";
import { Step, StepDbTableContext } from "./step.model";

export interface EssayTemplateStep extends DbForeignKey {
  id: number;
  order: number;
  essay_template_id: number;
  step_id: number;
  foreign: {
    essayTemplate?: EssayTemplate,
    step?: Step,
  };
}

export const EssayTemplateStepDbTableContext: DbTableContext = {
  tableName: 'essay_templates_steps',
  foreignTables: [
    {
      tableName: EssayTemplateDbTableContext.tableName,
      foreignKey: 'essay_template_id',
      properyName: 'essayTemplate',
    },
    {
      tableName: StepDbTableContext.tableName,
      foreignKey: 'step_id',
      properyName: 'step',
    },
  ],
};

export const EssayTemplateStepTableColumns: AbmColum[] = [];
