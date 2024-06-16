import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
import { UserStoreService } from '../../Services/user-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

users:any=[];
 FullName:string ="";
 Role:string="";
constructor(private auth:AuthService,private route:Router,private UserService:UserService,private userstore:UserStoreService) {
  
}
  ngOnInit(): void {
    this.UserService.GetAllUser().subscribe((res)=>{
      this.users=res;

    });
this.userstore.getFullNamrFromStore().subscribe(val=>{
  let getFullnamefromToken=this.auth.getFullnamefromToken();
  this.FullName=val || getFullnamefromToken
});   

this.userstore.getRoleFromStore().subscribe(val=>{
  let getRoleFromToken=this.auth.getRoleFromToken();
  this.Role=val || getRoleFromToken

})

  }
Logout()
{

  this.auth.LogOut();
}
}
