import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { NgToastService } from 'ng-angular-popup';


export const authGuard: CanActivateFn = (route, state) => {

    const auth = inject(AuthService)
    const rout = inject(Router)
    const toast=inject(NgToastService)
    if (auth.IsLoggedIn()) {
        return true;
    }
    else {
        toast.danger("Please Login First!!!","DANGER",5000)
        rout.navigate(['login']);
        return false;

    }



};
