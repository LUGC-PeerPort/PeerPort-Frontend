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

  GRADES: any;
  COURSES: any;
  courseId: string | undefined;
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;


  userGrades: any;
  userAverageGrade: any;

  courseAverageGrade:any;

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}

//GET
  getAllGradesForCourse(courseId:string):void{
    this.CourseService.getAllGradesForCourse(courseId).subscribe(response=>{
      this.GRADES = response;
    });
  }

  getAllGradesForUser(courseId:string, userId:string):void{
    this.CourseService.getAllGradesForUserByCourse(courseId,userId).subscribe(response=>{
      this.userGrades = response;
    })
  }

  getAverageGradeOfCourse(courseId:string):void{
    this.CourseService.getAverageGradeForCourse(courseId).subscribe(response=>{
      this.courseAverageGrade = response;
    })
  }

  getAverageGradeForUser(courseId:string, userId:string):void{
    this.CourseService.getAverageGradeForUser(courseId,userId).subscribe(response=>{
      this.userAverageGrade = response;
    })
  }


  //CREATE
  createGrade():void{}
  //EDIT
  editGrade():void{}
  //DELETE
  deleteGrade():void{}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.CourseService.getCourseById(params['id']).subscribe(response => {
        this.COURSES = response;
      })
    });
  }

}
