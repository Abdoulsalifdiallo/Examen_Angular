import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ClientDashboard } from './client-dashboard/client-dashboard';

@NgModule({
  declarations: [ClientDashboard],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
