import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BalanceResponse,
  CreateWalletDto,
  DepositDto,
  Wallet,
  WalletPage,
  WithdrawDto,
} from '../models/wallet.model';
import { Transaction, TransferDto } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class WalletApiService {
  private readonly base = '/api/wallets';

  constructor(private http: HttpClient) {}

  getWallets(page: number, size: number): Observable<WalletPage> {
    return this.http.get<WalletPage>(this.base, { params: { page, size } });
  }

  createWallet(payload: CreateWalletDto): Observable<Wallet> {
    return this.http.post<Wallet>(this.base, payload);
  }

  getWallet(phone: string, context?: HttpContext): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.base}/${phone}`, { context });
  }

  getBalance(phone: string): Observable<BalanceResponse> {
    return this.http.get<BalanceResponse>(`${this.base}/${phone}/balance`);
  }

  deposit(walletId: number, payload: DepositDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.base}/${walletId}/deposit`, payload);
  }

  withdraw(payload: WithdrawDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.base}/withdraw`, payload);
  }

  transfer(payload: TransferDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.base}/transfer`, payload);
  }

  getTransactions(phone: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.base}/${phone}/transactions`);
  }
}
