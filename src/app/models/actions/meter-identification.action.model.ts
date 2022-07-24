import { FormArray, FormGroup } from "@angular/forms";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { ActionEnum, ExecutionStatus } from "./action.model";
import { StandIdentificationAction } from "./stand-identification.action.model";

class StandIdentificationDecorator implements StandIdentificationAction {
  protected action: StandIdentificationAction;

  get actionEnum(): ActionEnum {
    return this.action.actionEnum;
  }

  get form(): FormGroup {
    return this.action.form;
  }

  get name(): string {
    return this.action.name;
  }

  get executionStatus$(): BehaviorSubject<ExecutionStatus> {
    return this.action.executionStatus$;
  }

  get standArray(): FormArray<FormGroup> {
    return this.action.standArray;
  }

  get destroyed$(): ReplaySubject<boolean> {
    return this.action.destroyed$;
  }

  get hiddenFields(): Record<string, boolean> {
    return this.action.hiddenFields;
  }

  constructor(action: StandIdentificationAction) {
    this.action = action;
  }

  buildForm(): FormGroup<any> {
    return this.action.buildForm();
  }
}

export class StandIdentificationMinimalFieldsDecorator extends StandIdentificationDecorator {
  override get hiddenFields(): Record<string, boolean> {
    return {
      serialNumber: true,
      yearOfProduction: true,
      hasManufacturingInformation: false,
    };
  }
}