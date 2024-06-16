import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { catchError, throwError } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  var Auth=inject(AuthService);
  var toaster=inject(NgToastService)
  var route=inject(Router);
  const MyToken=Auth.GetToken();
 if(MyToken)
  {
    req=req.clone({
      setHeaders:{Authorization: `Bearer ${MyToken}`}
    })
  }
  return next(req).pipe(catchError((err:any)=>{
    if(err instanceof HttpErrorResponse)
        {
          if(err.status==401)
            {
              toaster.warning("Token Expired, Log in again","WARNING",5000);
              route.navigate(['login'])

            }
        }
        return throwError(()=> new Error("Some other Error Occured"));
  }));
};


