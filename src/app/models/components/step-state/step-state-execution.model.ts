import { ActionLink, StepStateEnum } from "../step-component.model";
import { StepState } from "./step-state.model";

export class StepStateExecution extends StepState {
  getActions(): ActionLink[] {
    return this.stepComponent.actions
       .filter(({ workInStepStates }) =>  workInStepStates.includes(StepStateEnum.EXECUTION));
  }
}