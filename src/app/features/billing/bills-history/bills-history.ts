import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { WalletApiService } from '../../../services/wallet-api.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-bills-history',
  standalone: false,
  templateUrl: './bills-history.html',
})
export class BillsHistory implements OnInit {
  private phone: string;
  payments: Transaction[] = [];
  loading = false;

  constructor(
    private auth: AuthService,
    private walletApi: WalletApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.phone = this.auth.session?.phone ?? '';
  }

  ngOnInit(): void {
    this.loading = true;
    this.walletApi.getTransactions(this.phone).subscribe({
      next: (transactions) => {
        this.payments = transactions.filter((t) => t.type === 'PAYMENT');
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
