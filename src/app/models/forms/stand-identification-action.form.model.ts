import { FormControl } from "@angular/forms";
import { ActionForm } from "./action.form.model"

export interface StandIdentificationActionForm extends ActionForm {
  // TODO:
}

export interface StandArrayForm {
  standIndex: FormControl<number | null | undefined>;
  isActive: FormControl<boolean | null | undefined>;
  meterId: FormControl<number | null | undefined>,
  serialNumber: FormControl<string | null | undefined>,
  yearOfProduction: FormControl<number | null | undefined>,
}

export interface StandArrayFormValue {
  standIndex: number | null | undefined;
  isActive: boolean | null | undefined;
  meterId: number | null | undefined;
  serialNumber: string | null | undefined;
  yearOfProduction: number | null | undefined;
}
