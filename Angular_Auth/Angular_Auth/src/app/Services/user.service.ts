import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private HttpClient:HttpClient) { }
  URL:string="https://localhost:7065/api/User/";

  GetAllUser()
  {
    return this.HttpClient.get<any>(this.URL);
  }

}
