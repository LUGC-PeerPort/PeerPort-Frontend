import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface course {
  name: string;
  coourseCode: string;
  isOpen: boolean;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  courseId: string;
  enrolledOn: Date | string;
};

interface assignment {
name: string;
description: string;
dueDate: Date | string;
assignmentId: string;
}

interface error {
  message: string;
};


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
  getCourseById(courseId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}`);
  }

  //create course
  createCourse(course: any) {
    return this.http.post(`${this.courseUrl}courses`, course);
  }

  //update course
  updateCourse(courseId: string, course: any) {
    return this.http.put(`${this.courseUrl}courses/${courseId}`, course);
  }

  //delete course
  deleteCourse(courseId: string) {
    return this.http.delete(`${this.courseUrl}courses/${courseId}`);
  }

  // Assignment-related methods
  // get assignments in specific course
  getAllAssignmentsByCourseId(courseId: string) {
    return this.http.get<error | assignment>(`${this.courseUrl}courses/${courseId}/assignments`);
  }

  //get specific assignment in specific course
  getAssignmentById(courseId: string, assignmentId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`);
  }

  //create assignment
  createAssignment(assignment: any) {
    return this.http.post(`${this.courseUrl}assignments`, assignment);
  }

  //update assignment
  updateAssignment(courseId: string, assignmentId: string, assignment: any) {
    return this.http.put(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`, assignment);
  }

  //delete assignment
  deleteAssignment(courseId: string, assignmentId: string) {
    return this.http.delete(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`);
  }

  //Get course By ID
  //get all course user is in
  getAllCoursesByUserId(userId: string) {
    return this.http.get<error | course>(`${this.courseUrl}users/${userId}/courses`, {withCredentials: true});
  }

  //get specific course user is in
  getCourseByUserId(userId: string, courseId: string) {
    return this.http.get(`${this.courseUrl}users/${userId}/courses/${courseId}`, {withCredentials: true});
  };

}
