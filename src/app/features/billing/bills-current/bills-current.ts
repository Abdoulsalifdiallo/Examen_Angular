import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { BalanceStoreService } from '../../../core/services/balance-store.service';
import { ToastService } from '../../../core/services/toast.service';
import { BillingApiService } from '../../../services/billing-api.service';
import { Facture, ServiceName } from '../../../models/facture.model';

@Component({
  selector: 'app-bills-current',
  standalone: false,
  templateUrl: './bills-current.html',
})
export class BillsCurrent implements OnInit {
  private phone: string;
  private walletCode: string;

  factures: Facture[] = [];
  selectedRefs = new Set<string>();
  fournisseur = '';
  loading = false;
  paying = false;

  fournisseurs: ServiceName[] = ['ISM', 'WOYAFAL'];

  constructor(
    private auth: AuthService,
    private balanceStore: BalanceStoreService,
    private billingApi: BillingApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.phone = this.auth.session?.phone ?? '';
    this.walletCode = this.auth.session?.walletCode ?? '';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.billingApi.getCurrentFactures(this.walletCode, this.fournisseur || undefined).subscribe({
      next: (factures) => {
        this.factures = factures;
        this.selectedRefs.clear();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  toggle(reference: string): void {
    if (this.selectedRefs.has(reference)) {
      this.selectedRefs.delete(reference);
    } else {
      this.selectedRefs.add(reference);
    }
  }

  get selectedFactures(): Facture[] {
    return this.factures.filter((f) => this.selectedRefs.has(f.reference));
  }

  get totalSelected(): number {
    return this.selectedFactures.reduce((sum, f) => sum + f.montantDu, 0);
  }

  payerSelection(): void {
    if (this.selectedRefs.size === 0) return;
    const groups = new Map<ServiceName, string[]>();
    for (const facture of this.selectedFactures) {
      const refs = groups.get(facture.serviceName) ?? [];
      refs.push(facture.reference);
      groups.set(facture.serviceName, refs);
    }

    this.paying = true;
    const calls = Array.from(groups.entries()).map(([serviceName, factureReferences]) =>
      this.billingApi.payFactures({ phoneNumber: this.phone, serviceName, factureReferences }),
    );

    forkJoin(calls).subscribe({
      next: () => {
        this.paying = false;
        this.toast.success('Factures payées avec succès.');
        this.balanceStore.refresh(this.phone);
        this.load();
        this.cdr.markForCheck();
      },
      error: () => {
        this.paying = false;
        this.cdr.markForCheck();
      },
    });
  }
}
