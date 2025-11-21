import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../../services/data.service';

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

  courseId: string | null = null;

  constructor(private authService: AuthService, private dataService: DataService) {}

  resetId(){
    this.courseId = null;
  }

  ngOnInit(): void {
    this.apiUrl = environment.courseApi;
    
    // check auth service for global username so we can show / hide links
    this.authService.currentUser().subscribe((response) => {
      this.User = response as {userId: string};
    });

    this.dataService.currentMessage.subscribe(message => {
      this.courseId = message;
      console.log(this.courseId);
    })
  };
}
