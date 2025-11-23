import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { DataService } from '../../services/data.service';

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

  constructor(private route: ActivatedRoute, private CourseService: CourseService, private dataService: DataService){}

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
  createGrade(courseId:string, userId:string, assignmentSubmissionId:string, grade:any):void{
    this.CourseService.createGradeForAssignment(courseId, userId, assignmentSubmissionId, grade).subscribe(response=>{
    });
  }
  //EDIT
  editGrade(gradeId:string):void{

    const editedGrade = {
     
    }

    this.CourseService.editGrade(gradeId, editedGrade).subscribe(response=>{
      const index = this.GRADES.findIndex((g:any) => g.gradeId === gradeId);
      if (index !== -1) {
        this.GRADES[index] = { ...this.GRADES[index], ...response };
      }
    });
  }
  //DELETE
  deleteGrade(gradeId:string):void{
    this.CourseService.deleteGrade(gradeId).subscribe(response=>{
      console.log("Grade deleted.");
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.CourseService.getCourseById(params['id']).subscribe(response => {
        this.COURSES = response;
      })
      this.dataService.changeMessage(params['id']);
    });
  }

}
