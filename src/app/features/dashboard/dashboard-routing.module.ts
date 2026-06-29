import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboard } from './client-dashboard/client-dashboard';

const routes: Routes = [{ path: '', component: ClientDashboard }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
