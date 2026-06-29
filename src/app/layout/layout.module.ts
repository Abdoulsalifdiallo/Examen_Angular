import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { Shell } from './shell/shell';

@NgModule({
  declarations: [Header, Sidebar, Shell],
  imports: [SharedModule],
  exports: [Shell],
})
export class LayoutModule {}
