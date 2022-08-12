import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EssayErrorCodeEnum, EssayErrorMessages, EssayTemplate, EssayTemplateForm, EssayTemplateStep } from "../models";


const name = (essayTemplate: EssayTemplate): boolean => {
  return !essayTemplate.name || essayTemplate.name.length === 0;
};

const ruleAtLeastOneStep = (steps: EssayTemplateStep[]): boolean => {
  return steps.length === 0;
};


export function essayTemplateValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const formGroup = form as FormGroup<EssayTemplateForm>;
    let errors: ValidationErrors = {};

    const { essayTemplateSteps, essayTemplate } = formGroup.controls;
    const essay: EssayTemplate = essayTemplate.getRawValue();
    const steps: EssayTemplateStep[] = essayTemplateSteps.getRawValue();

    if (name(essay)) {
      errors = { ...errors, [EssayErrorCodeEnum.name]: EssayErrorMessages[EssayErrorCodeEnum.name] };
    }

    if (ruleAtLeastOneStep(steps)) {
      errors = { ...errors, [EssayErrorCodeEnum.AtLeastOneStep]: EssayErrorMessages[EssayErrorCodeEnum.AtLeastOneStep] };
    }

    return Object.keys(errors) ? errors : null;
  }
};