import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdministrationComponent} from "./administration/administration.component";
import {authGuard} from "../../core/guards/auth.guard";


const routes: Routes = [
    {
        path: "administration",
        component: AdministrationComponent,
        canActivate : [authGuard],
        data: { requiredRoles : ['admin'] }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
