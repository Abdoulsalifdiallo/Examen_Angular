import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletAdminHome } from './wallet-admin-home/wallet-admin-home';

const routes: Routes = [{ path: '', component: WalletAdminHome }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletManagementRoutingModule {}
