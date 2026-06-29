import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletApiService } from '../../../services/wallet-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { phoneValidator } from '../../../shared/validators/phone.validator';
import { normalizePhone } from '../../../shared/utils/phone.util';
import { Wallet } from '../../../models/wallet.model';

@Component({
  selector: 'app-wallet-create',
  standalone: false,
  templateUrl: './wallet-create.html',
})
export class WalletCreate {
  @Output() created = new EventEmitter<Wallet>();

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private walletApi: WalletApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneValidator()]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.loading = true;
    this.walletApi
      .createWallet({
        email: payload.email!,
        phoneNumber: normalizePhone(payload.phone!),
        initialBalance: payload.initialBalance!,
      })
      .subscribe({
        next: (wallet) => {
          this.loading = false;
          this.toast.success(`Portefeuille ${wallet.code} créé avec succès.`);
          this.form.reset({ initialBalance: 0 });
          this.created.emit(wallet);
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
