import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, user } from '../../services/course.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.css'
})
export class ClassListComponent implements OnInit {
  students: user[] = [];
  courseId: string = '';
  selectedUserId: string = '';
  users: user[] = [];
  student: boolean = true;

  constructor(
    private courseService: CourseService, private route: ActivatedRoute, private auth: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.auth.currentUser().subscribe(currentUser => {
        if (currentUser.roleId !== "ff123156-7773-47f5-b5df-0ef54f864f8d") {
          this.student = false;
        }
      });
      this.courseId = params['id'];
      this.dataService.changeMessage(this.courseId);
      // Get all the students for the course
      this.loadStudents();

      // Get all users for adding to course
      if (!this.student) {
        this.loadUsers();
      }
    });
  }

  // Get all users
  loadUsers(): void {
    this.auth.getAllUsers().subscribe((users) => {
      if (!Array.isArray(users)) {
        console.error('Invalid response format for users:', users);
        return;
      }
      this.users = users.filter(user => !this.students.some(student => student.userId === user.userId));
    });
  }

  // Get the students in the course
  loadStudents(): void {
    this.courseService.getAllStudentsByCourseId(this.courseId).subscribe((students) => {
      if (!Array.isArray(students)) {
        console.error('Invalid response format for students:', students);
        return;
      }
      this.students = students;
    });
  }

  // Add a student to the course
  addStudent(userId: string): void {
    this.courseService.addStudentToCourse(this.courseId, userId).subscribe(() => {
      this.loadStudents();
      if (!this.student) {
        this.loadUsers();
      }
    });
  }

  // Remove a student from the course
  removeStudent(index: number): void {
    const user = this.students[index];

    this.courseService.removeStudentFromCourse(this.courseId, user.userId).subscribe(() => {
      this.loadStudents();
      if (!this.student) {
        this.loadUsers();
      }
    });
  }
}