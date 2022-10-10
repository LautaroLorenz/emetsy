import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { EnterTestValuesAction } from "../actions/enter-test-values.action.model";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { StandIdentificationAction } from "../actions/stand-identification.action.model";
import { ReplaySubject } from "rxjs";
import { ReportBootTestBuilder } from "../report/report-boot-test.model";
import { BootTestParametersAction } from "../actions/boot-test-parameters.action.model";
import { BootTestExecutionAction } from "../actions/boot-test-execution.action.model";

export class BootTestStep extends StepBuilder {

  constructor(
    essayTemplateStep: EssayTemplateStep,
    destroyed$: ReplaySubject<boolean>
  ) {
    const reportBuilder = new ReportBootTestBuilder();
    const standIdentificationAction = new StandIdentificationAction(destroyed$);
    const enterTestValuesAction = new EnterTestValuesAction(0);
    const bootTestParametersAction = new BootTestParametersAction();
    const bootTestExecutionAction = new BootTestExecutionAction(
      standIdentificationAction,
      enterTestValuesAction,
      bootTestParametersAction
    );

    const _actions: Action[] = [
      standIdentificationAction,
      enterTestValuesAction,
      bootTestParametersAction,
      bootTestExecutionAction,
    ];

    const _buildActions: Action[] = [
      standIdentificationAction,
      enterTestValuesAction,
      bootTestParametersAction,
    ];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}
