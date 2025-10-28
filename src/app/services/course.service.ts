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
  // get all courses
  getCourses() {
    return this.http.get(`${this.courseUrl}courses`);
  }

  // get specific course by id
  getCourseById(id: string) {
    return this.http.get(`${this.courseUrl}courses/${id}`);
  }

  //create course
  createCourse(course: any) {
    return this.http.post(`${this.courseUrl}courses`, course);
  }

  //update course
  updateCourse(id: string, course: any) {
    return this.http.put(`${this.courseUrl}courses/${id}`, course);
  }

  //delete course
  deleteCourse(id: string) {
    return this.http.delete(`${this.courseUrl}courses/${id}`);
  }

  // Assignment-related methods
  // get assignments in specific course
  getAssignmentsByCourseId(courseId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}/assignments`);
  }

  //get specific assignment in specific course
  getAssignmentById(courseId: string, assignmentId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`);
  }

  //create assignment
  createAssignment(courseId: string, assignment: any) {
    return this.http.post(`${this.courseUrl}courses/${courseId}/assignments`, assignment);
  }

  //update assignment
  updateAssignment(courseId: string, assignmentId: string, assignment: any) {
    return this.http.put(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`, assignment);
  }

  //delete assignment
  deleteAssignment(courseId: string, assignmentId: string) {
    return this.http.delete(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`);
  }

  //User-related methods
  //get user by id
  getUserById(id: string) {
    return this.http.get(`${this.courseUrl}users/${id}`);
  }

  //get all course user is in
  getCoursesByUserId(userId: string) {
    return this.http.get(`${this.courseUrl}users/${userId}/courses`);
  }

  //get specific course user is in
  getCourseByUserId(userId: string, courseId: string) {
    return this.http.get(`${this.courseUrl}users/${userId}/courses/${courseId}`);
  };

  //create user
  createUser(user: any) {
    return this.http.post(`${this.courseUrl}users`, user);
  }

  //update user
  updateUser(id: string, user: any) {
    return this.http.put(`${this.courseUrl}users/${id}`, user);
  }

  //delete user
  deleteUser(id: string) {
    return this.http.delete(`${this.courseUrl}users/${id}`);
  }

}
