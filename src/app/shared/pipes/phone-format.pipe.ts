import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat', standalone: false })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    const local = digits.startsWith('221') ? digits.slice(3) : digits;
    const groups = local.match(/.{1,2}/g) ?? [local];
    return `+221 ${groups.join(' ')}`;
  }
}
