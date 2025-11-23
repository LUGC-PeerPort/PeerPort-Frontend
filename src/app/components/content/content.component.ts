import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, content} from '../../services/course.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-content',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  COURSES: any;
  courseId: any;
  WEEKS: any;
  weekId: string | undefined;
  title: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  
  User: {userId: string} | null = null;
  userId: string | undefined;

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}
  
  //GET
  getAllCourseContent(courseId:string){
    this.CourseService.getAllContentForCourse(courseId).subscribe(response=>{
      this.WEEKS = response
    })
  }
  //CREATE
  
  //EDIT

  //DELETE
   

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    this.courseId = params['id'] as string;    

    this.CourseService.getAllContentForCourse(this.courseId).subscribe(response => {
      this.WEEKS = response;
    });

  });
  }

}
