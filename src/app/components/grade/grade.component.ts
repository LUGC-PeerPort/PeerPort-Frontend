import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, assignment, submission, grade, file, user } from '../../services/course.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NgFor,NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';




interface fileDetails extends file {
  url: SafeResourceUrl;
}

interface submissionWithGrade extends submission {
  grade: grade | null;
  files: fileDetails[];
}
interface assignmentWithSubmissions extends assignment {
  submissions: submissionWithGrade[];
}

@Component({
  selector: 'app-grade',
  imports: [NgFor,NgIf, FormsModule],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.css'
})
export class GradeComponent implements OnInit {

  // Variables
  user: { userId: string, roleId: string } | null = null;
  student: boolean = true;
  assignments: assignmentWithSubmissions[] = [];
  grades: grade[] = [];
  averageGrade: number = 0;
  courseId: string = "";
  courseName: string = "";
  users: user[] = [];

  // Grade variables
  minScore: number = 0;
  maxScore: number = 0;
  achievedScore: number = 0;
  weight: number = 0;
  gradeId: string = "";
  submissionId: string = "";

  // Popup controls
  isPopUpOpen: boolean = false;
  activity: Function = () => {};
  

  constructor(
    private sanitizer: DomSanitizer, 
    private route: ActivatedRoute, 
    private courses: CourseService, 
    private dataService: DataService, 
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Get the courseId from the route parameters
      this.courseId = params['id'];

      // Get the course name
      this.courses.getCourseById(this.courseId).subscribe(courseResponse => {
        this.courseName = courseResponse.name;
      });

      // Give the nav the courseId
      this.dataService.changeMessage(this.courseId);

      // Get the user info
      this.authService.currentUser().subscribe(userResponse => {
        this.user = userResponse;

        // If the user is not a student
        if (this.user.roleId !== "ff123156-7773-47f5-b5df-0ef54f864f8d") {
          this.student = false;

          // Get all grades for the course
          this.getAllGradesForCourse();

          // Get all assignments for the course
          this.getAllAssignments();

          // Get all the users in the course
          this.getAllUsersInCourse();
        } else {
          // Get all the grades for this course
          this.getAllGradesForUser();

          // Get all the assignments for this course
          this.getAllAssignments();
        }

        // Get the average grade for this course
        this.getAverageGradeOfCourse();
      });
    });
  }

  // Get all the grades for a course
  getAllGradesForCourse(): void {
    this.courses.getAllGradesForCourse(this.courseId).subscribe(response => {
      if (!Array.isArray(response)) {
        window.alert("Error encountered: " + response);
        return;
      }

      this.grades = response;
    });
  }

  // Get all the grades for a user in a course
  getAllGradesForUser(): void {
    this.courses.getAllGradesForUserByCourse(this.courseId, this.user!.userId).subscribe(response => {
      if (!Array.isArray(response)) {
        window.alert("Error encountered: " + response);
        return;
      }

      this.grades = response;
    });
  }

  // Get all assignments for a course
  getAllAssignments(): void {
    this.courses.getAllAssignmentsByCourseId(this.courseId).subscribe(response => {
      if (!Array.isArray(response)) {
        window.alert("Error encountered: " + response);
        return;
      }

      const assignments = response;

      // For each assignment, get the submissions
      for (const assignment of assignments) {
        this.getAllSubmissionsForAssignment(assignment);
      };

      console.log(assignments);
      this.assignments = assignments as assignmentWithSubmissions[];
    });
  }

  // Get all submissions for an assignment
  getAllSubmissionsForAssignment(assignment: assignment): void {
    this.courses.getAllSubmissionsForAssignment(assignment.assignmentId).subscribe(response => {
      // If the response is not an array, treat it as an error object
      if (!Array.isArray(response)) {
        window.alert("Error encountered: " + response);
        return;
      }

      // For each submission, find the corresponding grade
      (assignment as assignmentWithSubmissions).submissions = response.map((submission: submission): submissionWithGrade => {
        const grade = this.grades.find((g: grade) => g.assignmentSubmissionId === submission.assignmentSubmissionId);
        (submission as submissionWithGrade).grade = grade ?? null;

        // Map files to include url and type
        (submission as submissionWithGrade).files = submission.files.map((fileItem: file) => {
          const byteChars = atob(fileItem.file);
          const byteNumbers = new Array(byteChars.length);

          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          const type = detectMimeFromBytes(byteArray);

          (fileItem as fileDetails).url = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${type};base64,${fileItem.file}`);
          return fileItem as fileDetails;
        });

        return submission as submissionWithGrade;
      });
    });
  }

  // Get the average grade of a course
  getAverageGradeOfCourse(): void {
    this.courses.getAverageGradeForCourse(this.courseId).subscribe(response => {
      this.averageGrade = response.grade;
    });
  }

  // Get all users in the course
  getAllUsersInCourse(): void {
    this.courses.getAllStudentsByCourseId(this.courseId).subscribe(response => {
      if (!Array.isArray(response)) {
        window.alert("Error encountered: " + response);
        return;
      }

      this.users = response;
    });
  }


  // Create the grade
  createGrade(): void {
    // Define the grade using the component's properties
    const grade = {
      minScore:       Number(this.minScore),
      maxScore:       Number(this.maxScore),
      achievedScore:  Number(this.achievedScore),
      weight:         Number(this.weight)
    };

    // Get the submission
    let userId: string = "";
    this.assignments.forEach(assignment => {
      assignment.submissions.forEach(submission => {
        if (submission.assignmentSubmissionId === this.submissionId) {
          // Get the userId
          userId = submission.userId;
        }
      });
    });

    // Create the grade using the CourseService
    this.courses.createGradeForAssignment(this.courseId, userId, this.submissionId, grade).subscribe(response => {
      // Handle the response
      console.log("Grade created:", response);
    });
  }

  // Updates the grade
  updateGrade(): void {
    // Define the updated grade using the component's properties
    const updatedGrade = {
      minScore:       Number(this.minScore),
      maxScore:       Number(this.maxScore),
      achievedScore:  Number(this.achievedScore),
      weight:         Number(this.weight)
    };

    // Update the grade using the CourseService
    this.courses.editGrade(this.gradeId, updatedGrade).subscribe(response => {
      // Handle the response
      console.log("Grade updated:", response);
    });
  }

  // Deletes the grade
  deleteGrade(submissionId: string): void {
    // Get the gradeId for this submission
    const gradeId = this.getGradeId(submissionId);
    if (!gradeId) {
      console.log("No grade found for submission:", submissionId);
      return;
    }

    // Delete the grade using the CourseService
    this.courses.deleteGrade(gradeId).subscribe(response => {
      // Handle the response
      console.log("Grade deleted:", response);
    });
  }

  // Gets the gradeId for a submission
  getGradeId(submissionId:string): string | null {
    const grade = this.grades.find((g: any) => g.assignmentSubmissionId === submissionId);
    return grade ? grade.gradeId : null;
  }

  // Toggles the popup and sets variables
  togglePopUp(submissionId: string): void {
    // Set the submissionId
    this.submissionId = submissionId;

    // Get the grade Id for this submission
    const grade = this.grades.find((g: grade) => g.assignmentSubmissionId === submissionId);
    this.gradeId = grade?.gradeId ?? "";
    
    // If a grade exists set the details of the grade
    if (grade) {
      this.minScore = grade.minScore;
      this.maxScore = grade.maxScore;
      this.achievedScore = grade.achievedScore;
      this.weight = grade.weight;
    }

    // Toggle the popup
    this.isPopUpOpen = !this.isPopUpOpen;
  }

  // Calculates the grade percentage
  calculateGrade(grade: grade | null): number | null {
    if (!grade) return null;
    return (grade.achievedScore - grade.minScore) / (grade.maxScore - grade.minScore) * 100;
  }

  // Get the user name from userId
  getUserName(userId: string): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? user.name : "Unknown User";
  }
}

// Get the type of a file from its byte array
export function detectMimeFromBytes(bytes: Uint8Array): string {
    const hex = [...bytes]
      .map(b => b.toString(16).padStart(2, "0").toUpperCase())
      .join("");

    for (const sig in environment.fileSignatures) {
      if (hex.startsWith(sig)) {
        return environment.fileSignatures[sig];
      }
    }

      return "application/octet-stream"; // fallback
  }


