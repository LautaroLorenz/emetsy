import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { EnterTestValuesAction } from "../actions/enter-test-values.action.model";
import { ReportVacuumTestBuilder } from "../report/report-vacuum-test.model";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { StandIdentificationAction } from "../actions/stand-identification.action.model";
import { ReplaySubject } from "rxjs";
import { VacuumTestParametersAction } from "../actions/vacuum-test-parameters-action.model";
import { VacuumTestExecutionAction } from "../actions/vacuum-test-execution-action.model";

export class VacuumTestStep extends StepBuilder {

  constructor(
    essayTemplateStep: EssayTemplateStep,
    destroyed$: ReplaySubject<boolean>
  ) {
    const reportBuilder = new ReportVacuumTestBuilder();
    const standIdentificationAction = new StandIdentificationAction(destroyed$);
    const enterTestValuesAction = new EnterTestValuesAction(0);
    const vacuumTestParametersAction = new VacuumTestParametersAction();
    const vacuumTestExecutionAction = new VacuumTestExecutionAction(
      standIdentificationAction,
      enterTestValuesAction,
      vacuumTestParametersAction
    );

    const _actions: Action[] = [
      standIdentificationAction,
      enterTestValuesAction,
      vacuumTestParametersAction,
      vacuumTestExecutionAction,
    ];

    const _buildActions: Action[] = [
      standIdentificationAction,
      enterTestValuesAction,
      vacuumTestParametersAction,
    ];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}
