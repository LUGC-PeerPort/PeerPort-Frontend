import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

export class calendar{
    _id: string | undefined;
    date: string | undefined;
    taskDue: string | undefined;
}
@Component({
  selector: 'app-calendar',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent  implements OnInit{
   
  CALDATE: any;
  task: string | undefined;
  courseCode: string | undefined;
  daynum: boolean | undefined;
  daydate: string | undefined;
  
  
  

  User: any;
  userId: string | undefined;

   constructor(private service: CourseService, private authService: AuthService, private router: Router) { }

   
  getAssignments(): void{
    this.service.getCourses().subscribe(response => {
     this.CALDATE = response;
   });
  }

  getCurrentUser(): void{
    this.authService.currentUser().subscribe(response => {
      this.User = response;
    })
  }

  getCourseByUserId(): void{
    this.service.getAllCoursesByUserId(this.userId!).subscribe(response => { 
      // if(typeof response?.message === "undefined")
      // for(const course in response){
      //    this.service.getAllAssignmentsByCourseId(course.courseId).subscribe(assignments =>{ 
      //     this.assignments = assignments;
      //   } )
      // }
    });

  }

  ngOnInit(): void {
    this.getCurrentUser();
    // this.getCalendarByUserId();
  }

}
