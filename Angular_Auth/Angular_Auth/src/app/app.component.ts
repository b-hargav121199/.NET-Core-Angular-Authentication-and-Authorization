
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {  RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ToasterPosition } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    NgToastModule,
    
      ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular_Auth';
  ToasterPosition = ToasterPosition;
}
