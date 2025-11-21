import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-grade',
  imports: [],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.css'
})
export class GradeComponent implements OnInit {

  COURSES: any;
  courseId: string | undefined;
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}

//GET
  getAllGradesForCourse(courseId:string){
    this.CourseService.getAllGradesForCourse(courseId)
  }

  getAllGradesForUser(){

  }

  getAverageGradeOfCourse(){

  }

  getAverageGradeForUser(){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.CourseService.getCourseById(params['id']).subscribe(response => {
        this.COURSES = response;
      })
    });
  }

}
