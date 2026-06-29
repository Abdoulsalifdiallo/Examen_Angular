import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsCurrent } from './bills-current/bills-current';
import { BillsHistory } from './bills-history/bills-history';

const routes: Routes = [
  { path: 'current', component: BillsCurrent },
  { path: 'history', component: BillsHistory },
  { path: '', pathMatch: 'full', redirectTo: 'current' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
