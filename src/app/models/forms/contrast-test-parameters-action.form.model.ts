import { FormControl } from "@angular/forms";
import { ActionForm } from "./action.form.model"

export interface ContrastTestParametersActionForm extends ActionForm  {
  maxAllowedError: FormControl<number | null | undefined>;
  meterPulses: FormControl<number | null | undefined>;
  numberOfDiscardedResults: FormControl<number | null | undefined>;
}
