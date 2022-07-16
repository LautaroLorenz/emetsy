import { Component, EventEmitter, Input, Output } from "@angular/core";
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
  actionRawData: any;
}

@Component({
  template: ``
})
export class StepComponentClass implements StepComponent {

  actions: ActionLink[] = [];
  protected stepState!: StepState;

  @Input() stepStateEnum!: StepStateEnum;
  @Input() actionsRawData: any[] = [];
  @Output() actionsRawDataChange = new EventEmitter<any>();

  constructor() { }

  buildState(stepStateEnum: StepStateEnum): StepState {
    switch (stepStateEnum) {
      case StepStateEnum.BUILDER:
        return new StepStateBuilder(this);
      case StepStateEnum.EXECUTION:
        return new StepStateExecution(this);
    }
  }

  getActions(): ActionLink[] {
    return this.stepState.getActions();
  }

  setActionsRawData(actionLinks: ActionLink[]): void {
    this.actionsRawDataChange.emit(actionLinks.map(({ actionRawData }) => actionRawData))
  }
}