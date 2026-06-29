import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule) },
  {
    path: '',
    component: Shell,
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { role: 'client' },
        loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: '',
        canActivate: [roleGuard],
        data: { role: 'client' },
        loadChildren: () => import('./features/transactions/transactions.module').then((m) => m.TransactionsModule),
      },
      {
        path: 'bills',
        canActivate: [roleGuard],
        data: { role: 'client' },
        loadChildren: () => import('./features/billing/billing.module').then((m) => m.BillingModule),
      },
      {
        path: 'admin/wallets',
        canActivate: [roleGuard],
        data: { role: 'agent' },
        loadChildren: () =>
          import('./features/wallet-management/wallet-management.module').then((m) => m.WalletManagementModule),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
