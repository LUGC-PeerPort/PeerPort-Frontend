import { AbstractType, Injectable } from '@angular/core';
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

export interface content {
    contentId: string;
    courseId?: string;
    parentId?: string;
    name: string;
    description?: string;
    viewable: boolean;
    dateCreated: Date;
    dateUpdated: Date;
    subContent: content[];
}

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
    return this.http.get(`${this.courseUrl}courses`,{withCredentials: true});
  }

  // get specific course by id
  getCourseById(courseId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}`,{withCredentials: true});
  }

  //create course
  createCourse(course: any) {
    return this.http.post(`${this.courseUrl}courses`, course,{withCredentials: true});
  }

  //update course
  updateCourse(courseId: string, course: any) {
    return this.http.put(`${this.courseUrl}courses/${courseId}`, course,{withCredentials: true});
  }

  //delete course
  deleteCourse(courseId: string) {
    return this.http.delete(`${this.courseUrl}courses/${courseId}`,{withCredentials: true});
  }

  // Assignment-related methods
  // get assignments in specific course
  getAllAssignmentsByCourseId(courseId: string) {
    return this.http.get<error | assignment>(`${this.courseUrl}courses/${courseId}/assignments`,{withCredentials: true});
  }

  //get specific assignment in specific course
  getAssignmentById(courseId: string, assignmentId: string) {
    return this.http.get(`${this.courseUrl}courses/${courseId}/assignments/${assignmentId}`,{withCredentials: true});
  }

  //create assignment
  createAssignment(assignment: any) {
    return this.http.post(`${this.courseUrl}assignments`, assignment, {withCredentials: true});
  }

  //update assignment
  updateAssignment(assignmentId: string, assignment: any) {
    return this.http.put(`${this.courseUrl}assignments/${assignmentId}`, assignment,{withCredentials: true});
  }

  //delete assignment
  deleteAssignment(assignmentId: string) {
    return this.http.delete(`${this.courseUrl}assignments/${assignmentId}`,{withCredentials: true});
  }

  //Submit Assignment
  submitAssignment(assignmentId:string, submission:any){
    return this.http.post(`${this.courseUrl}assignments/${assignmentId}/submissions`, submission,{withCredentials: true});
  }
  //Get course By ID
  //get all course user is in
  getAllCoursesByUserId(userId: string) {
    return this.http.get<error | course>(`${this.courseUrl}users/${userId}/courses`, {withCredentials: true});
  }

  //get specific course user is in
  getCourseByUserId(userId: string, courseId: string) {
    return this.http.get(`${this.courseUrl}users/${userId}/courses/${courseId}`, {withCredentials: true});
  }

  //content for course page
  getAllContentByCourseId(courseId: string) {
    return this.http.get<error | content[]>(`${this.courseUrl}courses/${courseId}/content`);
  }

  //GRADES
  //GET
  getAllGradesForCourse(courseId:string){
    return this.http.get(`${this.courseUrl}grades/by-course/${courseId}`,{withCredentials: true});
  }

  getAllGradesForUserByCourse(courseId:string, userId:string){
    return this.http.get(`${this.courseUrl}grades/${userId}/${courseId}`,{withCredentials: true});
  }

  getAverageGradeForCourse(courseId:string){ 
    return this.http.get(`${this.courseUrl}grades/average/${courseId}`,{withCredentials:true});
  }

  getAverageGradeForUser(courseId:string,userId:string){
    return this.http.get(`${this.courseUrl}grades/calculated/${userId}/${courseId}`, {withCredentials:true});
  }

  //CREATE
  createGradeForAssignment(courseId:string, userId:string, assignmentSubmissionId:string, grade:any){
    return this.http.post(`${this.courseUrl}grades/${userId}/${courseId}/${assignmentSubmissionId}`, grade,{withCredentials:true});
  }

  //EDIT
  editGrade(gradeId:string, grade:any){
    return this.http.put(`${this.courseUrl}grades/by-id/${gradeId}`,grade,{withCredentials:true});
  }
  //DELETE
  deleteGrade(gradeId:string){
    return this.http.delete(`${this.courseUrl}/grade/by-id/${gradeId}`,{withCredentials:true});
  }


  //CONTENT 
  //GET
  getContentForCourse(courseId:string){
    return this.http.get(`${this.courseUrl}courses/${courseId}/content`,{withCredentials:true});
  }

  //CREATE
  createNewContentAttachedToSpecificCourse(courseId:string, content:any){
    return this.http.post(`${this.courseUrl}content/${courseId}`, content, {withCredentials:true});
  }

  //EDIT
  editCourseContentFromSpecificCourse(contentId:string, editedContent:any){
    return this.http.put(`${this.courseUrl}content/${contentId}`, editedContent, {withCredentials:true});
  }

  //DELETE
  deleteContent(contentId:string){
    return this.http.delete(`${this.courseUrl}content/${contentId}`, {withCredentials:true});
  }
}
