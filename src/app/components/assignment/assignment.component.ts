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
  SUBMISSIONS: any;
  courseId!: string; 
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  assignmentId: string|undefined;
  
  isEditPopupOpen = false;
  selectedAssignment: any = null;

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}

  //GET
  getAllAssignments(courseId:string): void{
    this.CourseService.getAllAssignmentsByCourseId(courseId).subscribe(response =>{
      this.ASSIGNMENTS = response;
    })
  }

  //CREATE
  createAssignment(name: string, description: string, dueDate: string): void{
    if(!this.courseId){
      console.log("Course Id is null");
      return;
    }

    const assignment = {
      name: name,
      description: description,
      dueDate: dueDate,
      courseId: this.courseId
    }

    this.CourseService.createAssignment(assignment).subscribe(response =>{
      this.ASSIGNMENTS.push(response);
      console.log("Assignment created:", response);
    })
  }
  //EDIT
  editAssignment(assignmentId:string, name:string, description:string, dueDate:string): void{

     const editedAssignment = {
      name: name,
      description: description,
      dueDate: dueDate,
    }

    this.CourseService.updateAssignment(assignmentId, editedAssignment).subscribe(response=>{ 
      const index = this.ASSIGNMENTS.findIndex((a:any) => a.assignmentId === assignmentId);
      if (index !== -1) {
        this.ASSIGNMENTS[index] = { ...this.ASSIGNMENTS[index], ...response };
      }
      console.log("assignment edited")
    })
  }
  
  openEditPopup(assignment:any){
    this.selectedAssignment = { ...assignment }; 
    this.isEditPopupOpen = true;
  }

  closeEditPopup(){
    this.isEditPopupOpen = false;
  }

  //DELETE
  deleteAssignment(assignmentId:string): void{
    this.CourseService.deleteAssignment(assignmentId).subscribe(response=>{
      console.log("Assignment deleted:",response);
    })
  }

  //SUBMIT
  submitAssignment(assignmentId: string, fileInput:HTMLInputElement ){
    const files = fileInput.files;

    if(!files|| files.length === 0){
      alert("Please seleect a file for upload.");
      return;
    }

      if(!assignmentId){
      alert("Invalid AssignmentId");
      return;
    }
    
    
    const file = files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  this.CourseService.submitAssignment(assignmentId, formData)
    .subscribe({
      next: () => alert('Assignment submitted successfully!'),
      error: (err) => alert('Error submitting assignment: ' + err)
    });
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
