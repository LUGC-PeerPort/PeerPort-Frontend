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
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  User: {userId: string} | null = null;
  userId: string | undefined;

  constructor(private service: CourseService, private authService: AuthService, private router: Router, private dataService: DataService) { }

  getCoursesByUserId(userId: string): void{
    this.service.getAllCoursesByUserId(userId).subscribe(response => {
      this.COURSES = response;
    });
  }

  saveId(id: string){
    this.dataService.changeMessage(id);
    console.log(id);
  }

  ngOnInit(): void {
    this.authService.currentUser().subscribe(response => {
      this.User = response as { userId: string };

      if (this.User && this.User.userId) {
        this.getCoursesByUserId(this.User.userId);
      } else {
        console.log("No User");
      }
    });
  }

}
