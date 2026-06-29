import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { BalanceStoreService } from '../../../core/services/balance-store.service';
import { WalletApiService } from '../../../services/wallet-api.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: false,
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss',
})
export class ClientDashboard implements OnInit {
  balance$: Observable<number>;
  phone = '';
  fullName = '';
  totalIncome = 0;
  totalExpense = 0;
  recentTransactions: Transaction[] = [];

  constructor(
    private auth: AuthService,
    private balanceStore: BalanceStoreService,
    private walletApi: WalletApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.balance$ = this.balanceStore.balance$;
  }

  ngOnInit(): void {
    const session = this.auth.session;
    if (!session) return;
    this.phone = session.phone;
    this.fullName = session.fullName;
    this.balanceStore.refresh(this.phone);
    this.walletApi.getTransactions(this.phone).subscribe((transactions) => {
      this.recentTransactions = transactions.slice(0, 5);
      this.totalIncome = transactions
        .filter((t) => t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN')
        .reduce((sum, t) => sum + t.amount, 0);
      this.totalExpense = transactions
        .filter((t) => t.type === 'WITHDRAW' || t.type === 'TRANSFER_OUT' || t.type === 'PAYMENT')
        .reduce((sum, t) => sum + t.amount, 0);
      this.cdr.markForCheck();
    });
  }

  get expenseRatio(): number {
    const total = this.totalIncome + this.totalExpense;
    return total === 0 ? 0 : Math.round((this.totalExpense / total) * 100);
  }

  get incomeRatio(): number {
    return 100 - this.expenseRatio;
  }

  transactionLabel(tx: Transaction): string {
    switch (tx.type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAW':
        return 'Retrait';
      case 'TRANSFER_IN':
        return `Transfert reçu de ${tx.counterparty ?? ''}`;
      case 'TRANSFER_OUT':
        return `Transfert envoyé à ${tx.counterparty ?? ''}`;
      case 'PAYMENT':
        return `Paiement facture ${tx.counterparty ?? ''}`;
      default:
        return tx.type;
    }
  }

  transactionIcon(tx: Transaction): string {
    switch (tx.type) {
      case 'DEPOSIT':
        return 'bi-arrow-down-circle-fill text-success';
      case 'WITHDRAW':
        return 'bi-arrow-up-circle-fill text-danger';
      case 'TRANSFER_IN':
        return 'bi-box-arrow-in-down-left text-success';
      case 'TRANSFER_OUT':
        return 'bi-box-arrow-up-right text-danger';
      case 'PAYMENT':
        return 'bi-receipt text-warning';
      default:
        return 'bi-dot';
    }
  }
}
