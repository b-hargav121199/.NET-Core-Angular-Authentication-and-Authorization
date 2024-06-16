import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from "@auth0/angular-jwt"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BaseURL:string ="https://localhost:7065/api/User/"
  private UserPaylod:any;
  constructor(private httpclient:HttpClient,private route:Router)
   {
      this.UserPaylod=this.DecodeToken();
  }

  Signup(UserObj:any)
  {

    return this.httpclient.post<any>(`${this.BaseURL}register`,UserObj);
  }
  Login(LoginObj:any)
  {
    return this.httpclient.post<any>(`${this.BaseURL}authenticate`,LoginObj);
  }

  SetToken(TokenVaue:string)
  {
    localStorage.setItem('Token',TokenVaue);    
  }
  GetToken()
  {
    return localStorage.getItem('Token');
  }

  IsLoggedIn():boolean
  {
    return !! localStorage.getItem('Token');
  }
  LogOut()
  {
    localStorage.clear();
    this.route.navigate(['login']);
  }
  DecodeToken()
  {
    const jwtHalper= new JwtHelperService();
    const Token= this.GetToken()!;
    return jwtHalper.decodeToken(Token);
  }
  getFullnamefromToken(){


    if(this.UserPaylod)
      {
        return this.UserPaylod.unique_name;
      }
  }
  getRoleFromToken()
  {
  if(this.UserPaylod)
  {
    return this.UserPaylod.role;
  }
  }


}
