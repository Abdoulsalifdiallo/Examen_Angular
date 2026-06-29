import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { WalletApiService } from '../../../services/wallet-api.service';
import { phoneValidator } from '../../../shared/validators/phone.validator';
import { normalizePhone } from '../../../shared/utils/phone.util';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private walletApi: WalletApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      role: ['client', Validators.required],
      fullName: [''],
      phone: [''],
    });
    this.onRoleChange('client');
  }

  onRoleChange(role: string): void {
    const phoneControl = this.form.get('phone')!;
    const fullNameControl = this.form.get('fullName')!;
    if (role === 'client') {
      phoneControl.setValidators([Validators.required, phoneValidator()]);
      fullNameControl.clearValidators();
    } else {
      fullNameControl.setValidators([Validators.required]);
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
    fullNameControl.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    const { role, fullName, phone } = this.form.getRawValue();

    if (role === 'agent') {
      this.auth.login({ role: 'agent', phone: '', fullName: fullName || 'Agent' });
      this.router.navigate(['/admin/wallets']);
      return;
    }

    const normalized = normalizePhone(phone);
    this.loading = true;
    this.walletApi.getWallet(normalized).subscribe({
      next: (wallet) => {
        this.loading = false;
        this.auth.login({
          role: 'client',
          phone: wallet.phoneNumber,
          fullName: wallet.email,
          walletId: wallet.id,
          walletCode: wallet.code,
        });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Aucun portefeuille trouvé pour ce numéro.';
        this.cdr.markForCheck();
      },
    });
  }
}
