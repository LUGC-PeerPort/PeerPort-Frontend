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
  courseId: string | undefined;
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

  CourseId: {courseId: string} | null = null;

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}

  //GET
  getAllAssignments(courseId:string): void{
    this.CourseService.getAllAssignmentsByCourseId(courseId).subscribe(response =>{
      this.ASSIGNMENTS = response;
    })
  }

  //CREATE
  createAssignment(courseId:string): void{
    
    this.newAssignment.courseId = this.CourseId.courseId;
    
    this.CourseService.createAssignment(this.CourseId.courseId, this.newAssignment).subscribe(response =>{
      this.ASSIGNMENTS.push(response);
      this.newAssignment = {name:'', description:'',dueDate:'',courseId:''}
    })
  }


  ngOnInit(): void{
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      this.CourseId = { courseId };

      this.getAllAssignments(this.CourseId.courseId);

      this.CourseService.getCourseById(params['id']).subscribe(response => {
        this.COURSES = response;
      })  
    });
  }




}
