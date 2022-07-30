import { FormControl } from "@angular/forms";

export interface ActionForm {
  actionName: FormControl<string | null>;
}