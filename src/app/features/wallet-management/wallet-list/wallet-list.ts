import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WalletApiService } from '../../../services/wallet-api.service';
import { Wallet } from '../../../models/wallet.model';

@Component({
  selector: 'app-wallet-list',
  standalone: false,
  templateUrl: './wallet-list.html',
})
export class WalletList implements OnInit {
  wallets: Wallet[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  loading = false;

  constructor(
    private walletApi: WalletApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.walletApi.getWallets(this.page, this.size).subscribe({
      next: (result) => {
        this.wallets = result.content;
        this.totalPages = result.totalPages;
        this.totalElements = result.totalElements;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  next(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  previous(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }
}
