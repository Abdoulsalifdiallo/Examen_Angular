import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../models/auth.model';

interface NavLink {
  path: string;
  label: string;
}

const CLIENT_LINKS: NavLink[] = [
  { path: '/dashboard', label: 'Tableau de bord' },
  { path: '/transfer', label: 'Transfert' },
  { path: '/bills/current', label: 'Factures impayées' },
  { path: '/bills/history', label: 'Historique factures' },
  { path: '/transactions', label: 'Historique transactions' },
];

const AGENT_LINKS: NavLink[] = [{ path: '/admin/wallets', label: 'Portefeuilles' }];

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  links$: Observable<NavLink[]>;

  constructor(private auth: AuthService) {
    this.links$ = this.auth.session$.pipe(map((session) => this.linksForRole(session?.role)));
  }

  private linksForRole(role?: Role): NavLink[] {
    if (role === 'agent') return AGENT_LINKS;
    if (role === 'client') return CLIENT_LINKS;
    return [];
  }
}
