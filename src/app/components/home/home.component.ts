import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

export class Course{
    _id: string | undefined;
    name: string | undefined;
    courseCode: string | undefined;
    isOpen: boolean | undefined;
    description: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
}

export class User{
    _id: string | undefined;
}

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  COURSES: any;
  _id: string | undefined;
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  USERS: any;
  userId: string | undefined;

  constructor(private service: CourseService, private router: Router) { }

  // getCourses(): void{
  //   this.service.getCourses().subscribe(response => {
  //     this.COURSES = response;
  //   });
  // }

  getCoursesByUserId(): void{
    this.service.getCoursesByUserId(this.userId!).subscribe(response => {
      this.COURSES = response;
    });
  }

  ngOnInit(): void {
    //this.getCourses();
    this.getCoursesByUserId();
  }

}
