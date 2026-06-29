import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { BalanceStoreService } from '../../../core/services/balance-store.service';
import { ToastService } from '../../../core/services/toast.service';
import { WalletApiService } from '../../../services/wallet-api.service';
import { phoneValidator } from '../../../shared/validators/phone.validator';
import { differentPhoneValidator } from '../../../shared/validators/different-phone.validator';
import { phoneExistsValidator } from '../../../shared/validators/phone-exists.validator';
import { normalizePhone } from '../../../shared/utils/phone.util';

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.html',
})
export class Transfer {
  private currentPhone: string;
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private balanceStore: BalanceStoreService,
    private walletApi: WalletApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentPhone = this.auth.session?.phone ?? '';
    this.form = this.fb.group(
      {
        destination: [
          '',
          [Validators.required, phoneValidator()],
          [phoneExistsValidator(this.walletApi)],
        ],
        amount: [null as number | null, [Validators.required, Validators.min(1)]],
      },
      { validators: differentPhoneValidator(this.currentPhone) },
    );
    // L'asyncValidator s'exécute hors zone Angular (réponse HTTP) : on force
    // la détection de changement pour refléter l'état pending/valid/invalid.
    this.form.get('destination')!.statusChanges.subscribe(() => this.cdr.markForCheck());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { destination, amount } = this.form.getRawValue();
    this.loading = true;
    this.walletApi
      .transfer({
        senderPhone: this.currentPhone,
        receiverPhone: normalizePhone(destination!),
        amount: amount!,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.toast.success('Transfert effectué avec succès.');
          this.form.reset();
          this.balanceStore.refresh(this.currentPhone);
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
