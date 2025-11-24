import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, user } from '../../services/course.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface NewStudentPayload {
  name: string;
  email: string;
  profilePictureUrl: string;
  idNumber: string;
  role: string;
}

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.css'
})
export class ClassListComponent implements OnInit {
  students: user[] = [];
  courseId: string = '';

  constructor(
    private courseService: CourseService, private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
      this.loadStudents();
      this.dataService.changeMessage(this.courseId);
    });
  }

  loadStudents(): void {
    this.courseService.getAllStudentsByCourseId(this.courseId).subscribe((students) => {
      if (!Array.isArray(students)) {
        console.error('Invalid response format for students:', students);
        return;
      }
      this.students = students;
    });
  }

  addStudent(): void {
    const newStudent: NewStudentPayload = {
      name: 'New user',
      email: 'user@example.com',
      profilePictureUrl: 'https://example.com/',
      idNumber: 'ID1234',
      role: 'user'
    };


    this.courseService.addStudentToCourse(this.courseId, newStudent).subscribe(() => {
      this.loadStudents();
    });
  }

  viewStudent(user: user): void {
    console.log('Viewing user:', user);
  }

  removeStudent(index: number): void {
    const user = this.students[index];

    this.courseService.removeStudentFromCourse(this.courseId, user.userId).subscribe(() => {
      this.students.splice(index, 1);
    });
  }
}