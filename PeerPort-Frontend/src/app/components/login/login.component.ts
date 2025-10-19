import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string | undefined;
  password: string | undefined;
  message: string | undefined;
  messageClass: string = 'alert alert-info';
  apiResponse: any;

  constructor(private authService: AuthService, private router: Router) { }

  login(){
    const user = {
      username: this.username,
      password: this.password
    }
    return this.authService.login(user).subscribe({
      next: response => {
        this.apiResponse = response;
        this.authService.setUsername(this.apiResponse.username);
        this.router.navigate(['/home'])
      },
      error: err => {
        this.messageClass = 'alert alert-danger';
        this.message = err.error.message;
      }
    });
  }
}
