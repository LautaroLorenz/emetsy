import { FormControl } from "@angular/forms";
import { ActionForm } from "./action.form.model"

export interface StandIdentificationActionForm extends ActionForm {
  // TODO:
}

export interface StandArrayForm {
  isActive: FormControl<boolean | null | undefined>;
  meterId: FormControl<number | null | undefined>,
  serialNumber: FormControl<number | null | undefined>,
  yearOfProduction: FormControl<number | null | undefined>,
}

export interface StandArrayFormValue {
  isActive: boolean | null | undefined;
  meterId: number | null | undefined;
  serialNumber: number | null | undefined;
  yearOfProduction: number | null | undefined;
}
