import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent implements OnInit {
  apiUrl: string | null = null;

  User: {userId: string} | null = null;
  userId: string | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.apiUrl = environment.courseApi;
    
    // check auth service for global username so we can show / hide links
    this.authService.currentUser().subscribe((response) => {
      this.User = response as {userId: string};
    });
  };
}
