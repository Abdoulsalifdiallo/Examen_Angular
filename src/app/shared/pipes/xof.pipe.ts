import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'xof', standalone: false })
export class XofPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  });

  transform(value: number | null | undefined): string {
    return this.formatter.format(value ?? 0);
  }
}
