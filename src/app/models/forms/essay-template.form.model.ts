import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";


export interface EssayTemplateForm {
  essayTemplate: FormGroup<any>;
  essayTemplateSteps: FormArray<FormControl<EssayTemplateStep>>;
}

export interface EssayTemplateFormValue {
  essayTemplate: any;
  essayTemplateSteps: EssayTemplateStep[];
}
