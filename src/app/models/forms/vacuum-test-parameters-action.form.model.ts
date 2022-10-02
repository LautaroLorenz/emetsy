import { FormControl } from "@angular/forms";
import { ActionForm } from "./action.form.model"

export interface VacuumTestParametersActionForm extends ActionForm  {
  maxAllowedPulses: FormControl<number | null | undefined>;
}
