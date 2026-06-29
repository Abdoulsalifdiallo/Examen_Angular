import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WalletManagementRoutingModule } from './wallet-management-routing.module';
import { WalletAdminHome } from './wallet-admin-home/wallet-admin-home';
import { WalletList } from './wallet-list/wallet-list';
import { WalletCreate } from './wallet-create/wallet-create';
import { WalletSearch } from './wallet-search/wallet-search';
import { DepositWithdraw } from './deposit-withdraw/deposit-withdraw';

@NgModule({
  declarations: [WalletAdminHome, WalletList, WalletCreate, WalletSearch, DepositWithdraw],
  imports: [SharedModule, WalletManagementRoutingModule],
})
export class WalletManagementModule {}
