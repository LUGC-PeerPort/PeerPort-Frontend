import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  userId: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  idNumber: string;
  role: string;
}

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
  students: Student[] = [];
  courseId: string = '';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.loadStudents();
  }

  loadStudents(): void {
    this.courseService.getAllStudentsByCourseId(this.courseId)
      .subscribe(
        (students: Student[]) => {
          this.students = students;
        },
        (err: unknown) => {
          console.error('Failed to load students:', err);
        }
      );
  }

  addStudent(): void {
     const newStudent: NewStudentPayload = {
      name: 'New Student',
      email: 'user@example.com',
      profilePictureUrl: 'https://example.com/',
      idNumber: 'ID1234',
      role: 'student'
    };


    this.courseService.addStudentToCourse(this.courseId, newStudent)
      .subscribe(
        (addedStudent: Student) => {
          this.students.push(addedStudent);
        },
        (err: unknown) => {
          console.error('Failed to add student:', err);
        }
      );
  }

  viewStudent(student: Student): void {
    console.log('Viewing student:', student);
  }

  removeStudent(index: number): void {
    const student = this.students[index];

    this.courseService.removeStudentFromCourse(this.courseId, student.userId)
      .subscribe(
        () => {
          this.students.splice(index, 1);
        },
        (err: unknown) => {
          console.error('Failed to remove student:', err);
        }
      );
  }
}