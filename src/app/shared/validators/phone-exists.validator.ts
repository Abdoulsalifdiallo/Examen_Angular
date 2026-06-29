import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpContext } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { WalletApiService } from '../../services/wallet-api.service';
import { normalizePhone } from '../utils/phone.util';
import { SKIP_ERROR_TOAST } from '../../core/http-context/skip-error-toast.token';

export function phoneExistsValidator(walletApi: WalletApiService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return of(control.value).pipe(
      debounceTime(400),
      switchMap((phone) => walletApi.getWallet(normalizePhone(phone), new HttpContext().set(SKIP_ERROR_TOAST, true)).pipe(
        map(() => null),
        catchError(() => of({ phoneNotFound: true })),
      )),
    );
  };
}
