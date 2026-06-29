import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const SENEGAL_PHONE_REGEX = /^(221)?(70|75|76|77|78)\d{7}$/;

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const digits = String(control.value).replace(/\D/g, '');
    return SENEGAL_PHONE_REGEX.test(digits) ? null : { invalidPhone: true };
  };
}
