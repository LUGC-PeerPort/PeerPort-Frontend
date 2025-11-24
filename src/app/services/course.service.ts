import { AbstractType, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface course {
  name: string;
  courseCode: string;
  isOpen: boolean;
  description: string | undefined;
  startDate: Date;
  endDate: Date | undefined;
  courseId: string;
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

export interface file {
  fileId: string;
  fileName: string;
  file: string;
}
export interface assignment {
  name: string;
  description: string;
  dueDate: Date | string;
  assignmentId: string;
  courseId: string;
  files: file[] | [];
}

export interface submission {
  comment: string;
  timeSubmitted: Date;
  userId: string;
  assignmentId: string;
  assignmentSubmissionId: string;
  files: file[] | [];
}


export interface error {
  message: string;
};

export interface grade {
    minScore: number;
    maxScore: number;
    achievedScore: number;
    weight: number;
    gradeId: string;
    userId: string;
    courseId?: string;
    assignmentSubmissionId?: string;
}

export interface user {
  userId: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  idNumber: string;
  role: string;
  droppedOn?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseUrl: string = environment.courseApi;

  constructor(private http: HttpClient) { }

  // COURSES
  // get all courses
  getCourses() {
    return this.http.get(`${this.courseUrl}courses`,{withCredentials: true});
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

  // get specific course by id
  getCourseById(courseId: string) {
    return this.http.get<course>(`${this.courseUrl}courses/${courseId}`,{withCredentials: true});
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

  // Get classlist
  getAllStudentsByCourseId(courseId: string) {
    return this.http.get<error | user[]>(`${this.courseUrl}courses/${courseId}/classlist`, {withCredentials: true});
  }

  // Enroll student in course
  addStudentToCourse(courseId: string, userId: any) {
    return this.http.post<error>(`${this.courseUrl}courses/enroll/${courseId}/${userId}`, {withCredentials: true});
  }

  // Remove student from course
  removeStudentFromCourse(courseId: string, userId: string) {
    return this.http.delete<error>(`${this.courseUrl}courses/enroll/${courseId}/${userId}`, {withCredentials: true});
  }

  //END COURSES

  // ASSIGNMENTS
  // get assignments in specific course
  getAllAssignmentsByCourseId(courseId: string) {
    return this.http.get<assignment[] | error>(`${this.courseUrl}courses/${courseId}/assignments`,{withCredentials: true});
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
  //END ASSIGNMENTS

  //GRADES
  //GET
  getAllGradesForCourse(courseId:string){
    return this.http.get<grade[] | error>(`${this.courseUrl}grades/by-course/${courseId}`,{withCredentials: true});
  }

  getAllGradesForUserByCourse(courseId:string, userId:string){
    return this.http.get<grade[] | error>(`${this.courseUrl}grades/${userId}/${courseId}`,{withCredentials: true});
  }

  getAverageGradeForCourse(courseId:string){ 
    return this.http.get<{grade: number}>(`${this.courseUrl}grades/average/${courseId}`,{withCredentials:true});
  }

  getAverageGradeForUser(courseId:string,userId:string){
    return this.http.get<{grade: number}>(`${this.courseUrl}grades/calculated/${userId}/${courseId}`, {withCredentials:true});
  }

  //CREATE
  createGradeForAssignment(courseId:string, userId:string, assignmentSubmissionId:string, grade:any){
    return this.http.post<grade>(`${this.courseUrl}grades/${userId}/${courseId}/${assignmentSubmissionId}`, grade,{withCredentials:true});
  }

  //EDIT
  editGrade(gradeId:string, grade:any){
    return this.http.put(`${this.courseUrl}grades/by-id/${gradeId}`,grade,{withCredentials:true});
  }
  //DELETE
  deleteGrade(gradeId:string){
    return this.http.delete(`${this.courseUrl}grades/by-id/${gradeId}`,{withCredentials:true});
  }
  //END GRADES

  //SUBMISSIONS
  //GET
  getAllSubmissionsForAssignment(assignmentId:string){
    return this.http.get<submission[] | error>(`${this.courseUrl}assignments/${assignmentId}/submissions`,{withCredentials:true});
  }

  getSpecificSubmission(submissionId:string){
    return this.http.get(`${this.courseUrl}submissions/${submissionId}`, {withCredentials:true});
  }

  //CONTENT 
  //GET
  getAllContentByCourseId(courseId:string){
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
  //END CONTENT
}
