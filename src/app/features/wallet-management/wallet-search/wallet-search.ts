import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletApiService } from '../../../services/wallet-api.service';
import { phoneValidator } from '../../../shared/validators/phone.validator';
import { normalizePhone } from '../../../shared/utils/phone.util';
import { Wallet } from '../../../models/wallet.model';

@Component({
  selector: 'app-wallet-search',
  standalone: false,
  templateUrl: './wallet-search.html',
})
export class WalletSearch {
  form: FormGroup;
  wallet: Wallet | null = null;
  notFound = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private walletApi: WalletApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      phone: ['', [Validators.required, phoneValidator()]],
    });
  }

  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.notFound = false;
    this.wallet = null;
    this.walletApi.getWallet(normalizePhone(this.form.value.phone!)).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onWalletUpdated(wallet: Wallet): void {
    this.wallet = wallet;
    this.cdr.markForCheck();
  }
}
