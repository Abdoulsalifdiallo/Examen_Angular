import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { WalletApiService } from '../../../services/wallet-api.service';
import { Transaction, TransactionType } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.html',
})
export class TransactionHistory implements OnInit {
  private phone: string;
  private allTransactions: Transaction[] = [];

  filterForm: FormGroup;
  transactions: Transaction[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private walletApi: WalletApiService,
    private cdr: ChangeDetectorRef,
  ) {
    this.phone = this.auth.session?.phone ?? '';
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      type: [''],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.walletApi.getTransactions(this.phone).subscribe({
      next: (transactions) => {
        this.allTransactions = transactions;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  applyFilters(): void {
    const { dateFrom, dateTo, type } = this.filterForm.getRawValue();
    this.transactions = this.allTransactions.filter((tx) => {
      const txDate = tx.timestamp.slice(0, 10);
      if (dateFrom && txDate < dateFrom) return false;
      if (dateTo && txDate > dateTo) return false;
      if (type && tx.type !== type) return false;
      return true;
    });
    this.cdr.markForCheck();
  }

  typeLabel(type: TransactionType): string {
    switch (type) {
      case 'DEPOSIT':
        return 'Dépôt';
      case 'WITHDRAW':
        return 'Retrait';
      case 'TRANSFER_IN':
        return 'Transfert reçu';
      case 'TRANSFER_OUT':
        return 'Transfert envoyé';
      case 'PAYMENT':
        return 'Paiement';
      default:
        return type;
    }
  }

  typeBadgeClass(type: TransactionType): string {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return 'bg-success-subtle text-success-emphasis';
      case 'WITHDRAW':
      case 'TRANSFER_OUT':
        return 'bg-danger-subtle text-danger-emphasis';
      case 'PAYMENT':
        return 'bg-warning-subtle text-warning-emphasis';
      default:
        return 'bg-secondary-subtle text-secondary-emphasis';
    }
  }
}
