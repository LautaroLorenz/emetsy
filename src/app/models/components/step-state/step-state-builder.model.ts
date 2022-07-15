import { ActionComponentEnum } from "../action-component.model";
import { StepStateEnum } from "../step-component.model";
import { StepState } from "./step-state.model";

export class StepStateBuilder extends StepState {
  getActions(): ActionComponentEnum[] {
    return this.stepComponent.actions
       .filter(({ workInStepStates }) =>  workInStepStates.includes(StepStateEnum.BUILDER))
       .map(({ actionEnum }) => actionEnum);
  }
}