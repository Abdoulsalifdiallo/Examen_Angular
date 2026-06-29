import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletApiService } from '../../../services/wallet-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Wallet } from '../../../models/wallet.model';

@Component({
  selector: 'app-deposit-withdraw',
  standalone: false,
  templateUrl: './deposit-withdraw.html',
})
export class DepositWithdraw {
  @Input({ required: true }) wallet!: Wallet;
  @Output() walletUpdated = new EventEmitter<Wallet>();

  depositForm: FormGroup;
  withdrawForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private walletApi: WalletApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.depositForm = this.fb.group({
      amount: [null as number | null, [Validators.required, Validators.min(1)]],
      paymentMethod: ['CREDIT_CARD', Validators.required],
    });
    this.withdrawForm = this.fb.group({
      amount: [null as number | null, [Validators.required, Validators.min(1)]],
    });
  }

  private refreshWallet(): void {
    this.walletApi.getWallet(this.wallet.phoneNumber).subscribe((wallet) => this.walletUpdated.emit(wallet));
  }

  deposit(): void {
    if (this.depositForm.invalid) {
      this.depositForm.markAllAsTouched();
      return;
    }
    const payload = this.depositForm.getRawValue();
    this.loading = true;
    this.walletApi.deposit(this.wallet.id, { amount: payload.amount!, paymentMethod: payload.paymentMethod! }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Dépôt effectué avec succès.');
        this.depositForm.reset({ paymentMethod: 'CREDIT_CARD' });
        this.refreshWallet();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  withdraw(): void {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      return;
    }
    const payload = this.withdrawForm.getRawValue();
    this.loading = true;
    this.walletApi.withdraw({ phoneNumber: this.wallet.phoneNumber, amount: payload.amount! }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Retrait effectué avec succès.');
        this.withdrawForm.reset();
        this.refreshWallet();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
