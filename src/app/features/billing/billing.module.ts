import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BillingRoutingModule } from './billing-routing.module';
import { BillsCurrent } from './bills-current/bills-current';
import { BillsHistory } from './bills-history/bills-history';

@NgModule({
  declarations: [BillsCurrent, BillsHistory],
  imports: [SharedModule, BillingRoutingModule],
})
export class BillingModule {}
