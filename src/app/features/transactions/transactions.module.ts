import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { Transfer } from './transfer/transfer';
import { TransactionHistory } from './transaction-history/transaction-history';

@NgModule({
  declarations: [Transfer, TransactionHistory],
  imports: [SharedModule, TransactionsRoutingModule],
})
export class TransactionsModule {}
