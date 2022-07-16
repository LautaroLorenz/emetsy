import { ActionLink, StepComponent } from "../step-component.model";

export abstract class StepState {
  protected stepComponent: StepComponent;

  constructor(stepComponent: StepComponent) {
    this.stepComponent = stepComponent;
  }

  abstract getActions(): ActionLink[];
}