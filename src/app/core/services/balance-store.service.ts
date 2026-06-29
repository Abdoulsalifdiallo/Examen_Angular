import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WalletApiService } from '../../services/wallet-api.service';

@Injectable({ providedIn: 'root' })
export class BalanceStoreService {
  private balanceSubject = new BehaviorSubject<number>(0);
  readonly balance$: Observable<number> = this.balanceSubject.asObservable();

  constructor(private walletApi: WalletApiService) {}

  refresh(phone: string): void {
    this.walletApi.getBalance(phone).subscribe((response) => this.balanceSubject.next(response.balance));
  }

  reset(): void {
    this.balanceSubject.next(0);
  }
}
