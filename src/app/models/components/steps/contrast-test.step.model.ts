import { Action } from "../actions/action.model";
import { ContrastTestParametersAction } from "../actions/contrast-test-parameters.action.model";
import { EnterTestValuesAction } from "../actions/enter-test-values.action.model";
import { RunConfigurationAction } from "../actions/run-configuration.action.model";
import { StepBuilder } from "./step-builder.model";

export class ContrastTestStep extends StepBuilder {

  constructor() {
    const enterTestValuesAction = new EnterTestValuesAction('Prueba de constraste', 0);
    const contrastTestParametersAction = new ContrastTestParametersAction();
    const runConfigurationAction = new RunConfigurationAction(0, 3);

    const _actions: Action[] = [
      enterTestValuesAction,
      contrastTestParametersAction,
      runConfigurationAction,
    ];
    
    const _buildActions: Action[] = [
      enterTestValuesAction,
      contrastTestParametersAction,
      runConfigurationAction,
    ];

    super(_actions, _buildActions);
  }

}
