import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import validateforms from '../../Helpers/validateforms';
import { AuthService } from '../../Services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../Services/user-store.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  text: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa fa-eye-slash";
  LoginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private route:Router,
    private toast:NgToastService,
    private UserStore:UserStoreService
  
  ){}
  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    })
  }

  hideshowpass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.text = "text" : this.text = "password"
  }
  OnSubmit()
  {
    if(this.LoginForm.valid)
      {
          this.auth.Login(this.LoginForm.value).subscribe({
            next:(res)=>{
              this.LoginForm.reset();
              this.auth.SetToken(res.token);
              const TokenPaylod=this.auth.DecodeToken();
              this.UserStore.setFullForStore(TokenPaylod.unique_name);
              this.UserStore.setRoleForStore(TokenPaylod.role);
              this.toast.success(res.message,"SUCCESS",5000);
              this.route.navigate(["dashboard"]); 
            },
            error:(err)=>{
              this.toast.danger(err.error.message,"DANGER",5000);
              
            
            }
          })
      }

      else
      {

        //throw the error by toaster and validation message
        validateforms.ValidateAllFormFields(this.LoginForm);
        alert("Your form is invalid");
      }


  }

}
