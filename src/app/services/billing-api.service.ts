import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facture, PayDto, PayFacturesDto } from '../models/facture.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class BillingApiService {
  private readonly facturesBase = '/api/external/factures';
  private readonly walletsBase = '/api/wallets';

  constructor(private http: HttpClient) {}

  getCurrentFactures(walletCode: string, unite?: string): Observable<Facture[]> {
    const params: Record<string, string> = {};
    if (unite) params['unite'] = unite;
    return this.http.get<Facture[]>(`${this.facturesBase}/${walletCode}/current`, { params });
  }

  getFacturesPeriode(walletCode: string, debut: string, fin: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.facturesBase}/${walletCode}/periode`, { params: { debut, fin } });
  }

  pay(payload: PayDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.walletsBase}/pay`, payload);
  }

  payFactures(payload: PayFacturesDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.walletsBase}/pay-factures`, payload);
  }
}
