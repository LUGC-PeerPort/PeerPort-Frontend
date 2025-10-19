import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseUrl: string = environment.courseApi;

  constructor(private http: HttpClient) { }

  // Course-related methods
  getCourses() {
    return this.http.get(`${this.courseUrl}courses`);
  }

  getCourseById(id: string) {
    return this.http.get(`${this.courseUrl}courses/${id}`);
  }

  createCourse(course: any) {
    return this.http.post(`${this.courseUrl}courses`, course);
  }

  updateCourse(id: string, course: any) {
    return this.http.put(`${this.courseUrl}courses/${id}`, course);
  }

  deleteCourse(id: string) {
    return this.http.delete(`${this.courseUrl}courses/${id}`);
  }

  // Assignment-related methods
  getAssignmentsByCourseId(courseId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}/assignments`);
  }

  getAssignmentById(courseId: string, assignmentId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`);
  }

  createAssignment(courseId: string, assignment: any) {
    return this.http.post(`${this.courseUrl}courses/${courseId}/assignments`, assignment);
  }

  updateAssignment(courseId: string, assignmentId: string, assignment: any) {
    return this.http.put(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`, assignment);
  }

  deleteAssignment(courseId: string, assignmentId: string) {
    return this.http.delete(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`);
  }

  //User-related methods
  getUsersByCourseId() {
    return this.http.get(`${this.courseUrl}users`);
  }

  getUserById(id: string) {
    return this.http.get(`${this.courseUrl}users/${id}`);
  }

  createUser(user: any) {
    return this.http.post(`${this.courseUrl}users`, user);
  }

  updateUser(id: string, user: any) {
    return this.http.put(`${this.courseUrl}users/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.courseUrl}users/${id}`);
  }

}
