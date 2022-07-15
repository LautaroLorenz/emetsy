import { ActionComponentEnum } from "./action-component.model";
import { StepStateBuilder } from "./step-state/step-state-builder.model";
import { StepStateExecution } from "./step-state/step-state-execution.model";
import { StepState } from "./step-state/step-state.model";

export enum StepStateEnum {
  BUILDER = 'BUILDER',
  EXECUTION = 'EXECUTION'
}

export interface StepComponent {
  stepStateEnum: StepStateEnum;
  actions: ActionLink[];
}

export interface ActionLink {
  actionEnum: ActionComponentEnum;
  workInStepStates: StepStateEnum[];
}

export class StepComponentClass implements StepComponent {

  stepStateEnum!: StepStateEnum;
  actions: ActionLink[] = [];
  protected stepState!: StepState;

  constructor() { }

  buildState(stepStateEnum: StepStateEnum): StepState {
    switch (stepStateEnum) {
      case StepStateEnum.BUILDER:
        return new StepStateBuilder(this);
      case StepStateEnum.EXECUTION:
        return new StepStateExecution(this);
    }
  }

  getActions(): ActionComponentEnum[] {
    return this.stepState.getActions();
  }
}