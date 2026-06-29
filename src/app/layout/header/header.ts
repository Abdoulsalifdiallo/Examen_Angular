import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BalanceStoreService } from '../../core/services/balance-store.service';
import { Session } from '../../models/auth.model';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
})
export class Header implements OnInit {
  session$: Observable<Session | null>;
  balance$: Observable<number>;

  constructor(
    private auth: AuthService,
    private balanceStore: BalanceStoreService,
    private router: Router,
  ) {
    this.session$ = this.auth.session$;
    this.balance$ = this.balanceStore.balance$;
  }

  ngOnInit(): void {
    const session = this.auth.session;
    if (session?.role === 'client') {
      this.balanceStore.refresh(session.phone);
    }
  }

  logout(): void {
    this.auth.logout();
    this.balanceStore.reset();
    this.router.navigate(['/login']);
  }
}
