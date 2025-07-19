import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import {authGuard} from "../core/guards/auth.guard";
import {LayoutComponent} from "../layouts/layout.component";

const routes: Routes = [
    {
        path: "",
        component: DashboardComponent,
        canActivate : [authGuard],
        data: { requiredRoles : ['admin'] }
    },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
