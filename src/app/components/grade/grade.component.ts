import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NgFor,NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grade',
  imports: [NgFor,NgIf, FormsModule],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.css'
})
export class GradeComponent implements OnInit {

  GRADES: any;
  COURSES: any;
  ASSIGNMENTS:any;
  SUBMISSIONS: any = {};
  courseId!: string;
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  User: {userId: string, userRole: string} | null = null;
  userId!: string;
  userRole: string | undefined;

  userGrades: any;
  userAverageGrade: any;

  courseAverageGrade:any;

  constructor(private route: ActivatedRoute, private CourseService: CourseService, private dataService: DataService, private authService: AuthService){}

//GET
  getAllGradesForCourse(courseId:string):void{
    this.CourseService.getAllGradesForCourse(courseId).subscribe(response=>{
      this.GRADES = response;
    });
  }

  getAllGradesForUser(courseId:string, userId:string):void{
    this.CourseService.getAllGradesForUserByCourse(courseId,userId).subscribe(response=>{
      this.userGrades = response;
    });
  }

  getAverageGradeOfCourse(courseId:string):void{
    this.CourseService.getAverageGradeForCourse(courseId).subscribe((response)=>{
      this.courseAverageGrade = response.grade;
    });
  }

  getAverageGradeForUser(courseId:string, userId:string):void{
    this.CourseService.getAverageGradeForUser(courseId,userId).subscribe(response=>{
      this.userAverageGrade = response;
    });
  }

  getAllAssignments(courseId:string){
    this.CourseService.getAllAssignmentsByCourseId(courseId).subscribe(response =>{
      this.ASSIGNMENTS = response;

      this.ASSIGNMENTS?.forEach((a: any) => this.getAllSubmissionsForAssignment(a.assignmentId));
    })
  }

  getAllSubmissionsForAssignment(assignmentId:string){
    this.CourseService.getAllSubmissionsForAssignment(assignmentId).subscribe(response =>{
      this.SUBMISSIONS[assignmentId] = response;
    })
  }

  //CREATE
  createGrade(courseId:string, userId:string, assignmentSubmissionId:string, grade:any):void{
    this.CourseService.createGradeForAssignment(courseId, userId, assignmentSubmissionId, grade).subscribe(response=>{
    });
  }

  //EDIT
  editGrade(gradeId:string, minScore:number,maxScore:number, achievedScore:number, weight:number):void{
    const editedGrade = {
     minScore: minScore,
     maxScore: maxScore,
     achievedScore: achievedScore,
     weight: weight
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
  this.authService.currentUser().subscribe(userResponse => {
    this.User = userResponse as { userId: string, userRole: string };
    if (this.User) {
      this.userId = this.User.userId;
      this.userRole = this.User.userRole;

      this.route.params.subscribe(params => {
        this.courseId = params['id'];
        this.dataService.changeMessage(this.courseId);

        this.CourseService.getCourseById(this.courseId).subscribe(courseResponse => {
          this.COURSES = courseResponse;
        });

        this.getAllAssignments(this.courseId);

        this.getAverageGradeOfCourse(this.courseId);

        this.getAverageGradeForUser(this.courseId, this.userId);
        this.getAllGradesForUser(this.courseId, this.userId);

        this.getAllGradesForCourse(this.courseId);
      });
    }
  });
}

  }


