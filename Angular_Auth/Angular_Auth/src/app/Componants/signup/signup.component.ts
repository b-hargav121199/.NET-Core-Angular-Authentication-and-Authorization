import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Validateform from '../../Helpers/validateforms';
import { AuthService } from '../../Services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  SignupForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private router:Router,
    private toast:NgToastService
  ) { }
  ngOnInit(): void {
    this.SignupForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['',[Validators.required, Validators.email] ],
      UserName: ['', Validators.required],
      Password: ['', Validators.required]


    });
  }
  text: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa fa-eye-slash";


  hideshowpass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.text = "text" : this.text = "password"
  }
  OnSubmit() {
    if (this.SignupForm.valid) {
      this.auth.Signup(this.SignupForm.value).subscribe({
        next:(res)=>{
          this.SignupForm.reset();
         this.router.navigate(['login']); 
         this.toast.success(res.message,"SUCCESS",5000);
        },
        error:(err)=>{
          this.toast.danger(err.error.message,"DANGER",5000);
        }

      });
    }
    else {
      Validateform.ValidateAllFormFields(this.SignupForm)
      alert("Your form is invalid");
    }
  }
  
  }
