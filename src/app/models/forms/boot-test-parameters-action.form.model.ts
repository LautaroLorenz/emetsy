import { FormControl } from "@angular/forms";
import { ActionForm } from "./action.form.model"

export interface BootTestParametersActionForm extends ActionForm  {
  allowedPulses: FormControl<number | null | undefined>;
  minDurationSeconds: FormControl<number | null | undefined>;
  maxDurationSeconds: FormControl<number | null | undefined>;
}
