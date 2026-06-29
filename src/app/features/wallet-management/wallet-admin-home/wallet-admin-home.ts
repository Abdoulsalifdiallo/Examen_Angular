import { Component, ViewChild } from '@angular/core';
import { WalletList } from '../wallet-list/wallet-list';

type Tab = 'list' | 'create' | 'search';

@Component({
  selector: 'app-wallet-admin-home',
  standalone: false,
  templateUrl: './wallet-admin-home.html',
})
export class WalletAdminHome {
  @ViewChild(WalletList) walletList?: WalletList;
  activeTab: Tab = 'list';

  setTab(tab: Tab): void {
    this.activeTab = tab;
    if (tab === 'list') {
      this.walletList?.load();
    }
  }

  onCreated(): void {
    this.setTab('list');
  }
}
