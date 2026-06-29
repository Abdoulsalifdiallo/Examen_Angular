import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function differentPhoneValidator(currentPhone: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const destination = group.get('destination')?.value;
    if (!destination) return null;
    const normalize = (p: string) => p.replace(/\D/g, '');
    return normalize(destination) === normalize(currentPhone) ? { sameAsSender: true } : null;
  };
}
