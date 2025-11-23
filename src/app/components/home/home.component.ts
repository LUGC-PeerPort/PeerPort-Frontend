import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

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
  isOpen: string = "";
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  User: {userId: string, userRole: string} | null = null;
  userId: string | undefined;
  userRole: string | undefined;

  constructor(private service: CourseService, private authService: AuthService, private router: Router, private dataService: DataService) { }

  //Get
  getCoursesByUserId(userId: string): void{
    this.service.getAllCoursesByUserId(userId).subscribe(response => {
      this.COURSES = response;
    });
  }

  //clears form and info so user doesn't mess up courses 
  resetForm(): void{
    this.courseId = undefined,
    this.name = undefined,
    this.courseCode = undefined,
    this.isOpen = "",
    this.description = undefined,
    this.startDate = undefined,
    this.endDate = undefined
  }

  //for when user clicks to update a course
  selectedCourse(course: any): void{
    this.courseId = course.courseId,
    this.name = course.name,
    this.courseCode = course.courseCode,
    this.isOpen = course.isOpen,
    this.description = course.description,
    this.startDate = course.startDate,
    this.endDate = course.endDate
  }

  //Update
  updateCourse(): void{
    let newCourse = {
      name: this.name,
      courseCode: this.courseCode,
      isOpen: this.isOpen == "true",
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate
    }

    console.log(newCourse)

    const id = this.courseId as string
    console.log(id)

    this.service.updateCourse(id, newCourse).subscribe(response => {
      if (this.User && this.User.userId) {
        this.getCoursesByUserId(this.User.userId);
      }
      this.resetForm();
    })
  }

  //Delete
  deleteCourse(courseId: string): void{
    this.service.deleteCourse(courseId).subscribe(response => {
      console.log("Course Deleted")
      
      if (this.User && this.User.userId) {
        this.getCoursesByUserId(this.User.userId);
      } else {
        console.log("No User");
      }
    });
  }

  //Create
  createCourse(): void{
    let newCourse = {
      name: this.name,
      courseCode: this.courseCode,
      isOpen: this.isOpen == "true",
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate
    }

    console.log(newCourse)

    this.service.createCourse(newCourse).subscribe(response => {
      if (this.User && this.User.userId) {
        this.getCoursesByUserId(this.User.userId);
      }
      this.resetForm();
    })
  }

  //save the course Id and send it to the Nav
  saveId(id: string){
    this.dataService.changeMessage(id);
    console.log(id);
  }

  ngOnInit(): void {
    this.authService.currentUser().subscribe(response => {
      this.User = response as { userId: string, userRole: string };

      if (this.User && this.User.userId) {
        this.getCoursesByUserId(this.User.userId);
      } else {
        console.log("No User");
      }
    });
  }

}
