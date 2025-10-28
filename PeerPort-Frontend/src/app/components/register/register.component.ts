import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string | undefined;
  confirm: string | undefined;
  message: string = 'Please choose a strong password';
  messageClass: string = 'alert alert-info';
  apiResponse: any;

  constructor(private authService: AuthService) {}

  register() {
    // this page redirects to google ouath

  }
}