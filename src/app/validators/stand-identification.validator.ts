import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

function getControls(formArray: AbstractControl): FormGroup[] {
  return (formArray as FormArray<FormGroup>).controls;
}

export function standIdentificationValidator(): ValidatorFn {
  return (formArray: AbstractControl<FormArray<FormGroup>>): ValidationErrors | null => {
    let valid: boolean = true;
    getControls(formArray).forEach((x: FormGroup) => {
      valid = valid && (!x.value.isActive || x.value.meterId !== null)
    })
    return valid ? null : { required: 'Hay valores requeridos sin completar' };
  }
};
