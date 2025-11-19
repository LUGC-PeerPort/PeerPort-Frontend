import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  COURSES: any;
  courseId: string | undefined;
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  User: any;
  userId: string | undefined;

  constructor(private service: CourseService, private authService: AuthService, private router: Router) { }

  getCourses(): void{
    this.service.getCourses().subscribe(response => {
     this.COURSES = response;
   });
  }

  getCurrentUser(): void{
    this.authService.currentUser().subscribe(response => {
      this.User = response;
    })
  }

  getCoursesByUserId(): void{
    this.service.getAllCoursesByUserId(this.userId!).subscribe(response => {
      this.COURSES = response;
    });
  }

  ngOnInit(): void {
    this.getCourses();
    this.getCurrentUser();
    // this.getCoursesByUserId();
  }
}
