import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, CoreModule, LayoutModule],
  providers: [provideZoneChangeDetection()],
  bootstrap: [App],
})
export class AppModule {}
