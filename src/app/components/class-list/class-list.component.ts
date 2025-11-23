import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class-list',
  imports: [NgFor, FormsModule],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.css'
})
export class ClassListComponent {
  students = [
    { name: 'Student 1' },
    { name: 'Student 2' },
    { name: 'Student 3' },
    { name: 'Student 4' }
  ];

  addStudent() {
    
  }

  viewStudent(student: any) {
   
  }

  removeStudent(index: number) {
    this.students.splice(index, 1);
  }
}
