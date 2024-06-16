import { Routes } from '@angular/router';
import { LoginComponent } from './Componants/login/login.component';
import { SignupComponent } from './Componants/signup/signup.component';
import { DashboardComponent } from './Componants/dashboard/dashboard.component';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
    {
        path :'',
        component :SignupComponent
    },

    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'dashboard',
        component:DashboardComponent,
        canActivate:[authGuard]

    }
];
