import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // check auth service for global username so we can show / hide links
    this.authService.username.subscribe((username) => {
      this.username = username;
    });
  };
}
