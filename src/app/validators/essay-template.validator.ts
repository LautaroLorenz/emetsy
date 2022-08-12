import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { EssayErrorCodeEnum, EssayErrorMessages, EssayTemplate, EssayTemplateForm, EssayTemplateStep, StepIdEnum } from "../models";


const name = (essayTemplate: EssayTemplate): boolean => {
  return !essayTemplate.name || essayTemplate.name.length === 0;
};

const atLeastOneStep = (steps: EssayTemplateStep[]): boolean => {
  return steps.length === 0;
};

const preparationRequired = (steps: EssayTemplateStep[]): boolean => {
  const hasPreparationStep = steps.some(({ step_id }) => step_id === StepIdEnum.PreparationStep);
  const requiredPreparationSteps = [StepIdEnum.ContrastTestStep];
  return !hasPreparationStep && steps.some(({ step_id }) => requiredPreparationSteps.includes(step_id));
};

const preparationOrderAfter = (steps: EssayTemplateStep[]): boolean => {
  let hasError = false;
  const requiredPreparationSteps = [StepIdEnum.ContrastTestStep];
  let preparationStep = false;
  for (let i = 0; i < steps.length; i++) {
    const { step_id } = steps[i];
    if (!preparationStep && step_id === StepIdEnum.PreparationStep) {
      preparationStep = true;
    }
    if (requiredPreparationSteps.includes(step_id)) {
      if (preparationStep) {
        preparationStep = false;
      } else {
        hasError = true;
        break;
      }
    }
  }
  return hasError;
};

const reportAtEnd = (steps: EssayTemplateStep[]): boolean => {
  const hasReport = steps.some(({ step_id }) => step_id === StepIdEnum.ReportStep);
  const reportIndex = steps.findIndex(({ step_id }) => step_id === StepIdEnum.ReportStep);
  return hasReport && reportIndex < steps.length - 1;
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

    if (atLeastOneStep(steps)) {
      errors = { ...errors, [EssayErrorCodeEnum.AtLeastOneStep]: EssayErrorMessages[EssayErrorCodeEnum.AtLeastOneStep] };
    }

    if (preparationRequired(steps)) {
      errors = { ...errors, [EssayErrorCodeEnum.PreparationRequired]: EssayErrorMessages[EssayErrorCodeEnum.PreparationRequired] };
    }

    if (preparationOrderAfter(steps)) {
      errors = { ...errors, [EssayErrorCodeEnum.PreparationOrderAfter]: EssayErrorMessages[EssayErrorCodeEnum.PreparationOrderAfter] };
    }

    if (reportAtEnd(steps)) {
      errors = { ...errors, [EssayErrorCodeEnum.ReportAtEnd]: EssayErrorMessages[EssayErrorCodeEnum.ReportAtEnd] };
    }

    return Object.keys(errors) ? errors : null;
  }
};