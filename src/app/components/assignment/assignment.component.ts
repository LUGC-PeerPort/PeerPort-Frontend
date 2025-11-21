import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-assignment',
  imports: [NgFor,NgIf, FormsModule],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css'
})
export class AssignmentComponent implements OnInit{

  COURSES: any;
  ASSIGNMENTS: any;
  courseId!: string; 
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  assignmentId: string|undefined;
  
  
  newAssignment = {
    name:'',
    description: '',
    dueDate:'',
    courseId:''
  }

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}

  //GET
  getAllAssignments(courseId:string): void{
    this.CourseService.getAllAssignmentsByCourseId(courseId).subscribe(response =>{
      this.ASSIGNMENTS = response;
    })
  }

  //CREATE
  createAssignment(courseId:string): void{
    if(!courseId){
      console.log("Course Id is null");
      return;
    }

    this.newAssignment.courseId = courseId;
    
    this.CourseService.createAssignment(this.newAssignment).subscribe(response =>{
      this.ASSIGNMENTS.push(response);
      this.newAssignment = {name:'', description:'',dueDate:'',courseId:''}
    })
  }


ngOnInit(): void {
  this.route.params.subscribe(params => {
  this.courseId = params['id'] as string;    

    this.CourseService.getCourseById(this.courseId).subscribe(response => {
      this.COURSES = response;
    });

    this.getAllAssignments(this.courseId);
  });
}




}
