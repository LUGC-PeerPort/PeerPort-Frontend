import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, assignment, submission, grade, file, user } from '../../services/course.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NgFor,NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// AI GENERATED TO SAVE TIME //
// A-3: Offset-0-only, normalized, deduplicated mapping
const FILE_SIGNATURES: Record<string, string> = {
  // Images
  "FFD8FFE0": "image/jpeg",
  "FFD8FFE1": "image/jpeg",
  "FFD8FFDB": "image/jpeg",
  "FFD8FFEE": "image/jpeg",
  "89504E470D0A1A0A": "image/png",
  "474946383761": "image/gif",        // GIF87a
  "474946383961": "image/gif",        // GIF89a
  "424D": "image/bmp",
  "49492A00": "image/tiff",           // II * little-endian TIFF
  "4D4D002A": "image/tiff",           // MM * big-endian TIFF
  "52494646": "application/x-riff",   // RIFF container (AVI/WAV/WEBP — needs later bytes to disambiguate)
  "52494646D07A": "image/webp",       // (some heuristics include WEBP later) - still generic as RIFF

  // Vector / other image formats
  "49492A": "image/tiff",
  "38425053": "image/vnd.adobe.photoshop", // PSD: 8BPS

  // Documents / text encoded certs
  "25504446": "application/pdf",      // %PDF
  "2D2D2D2D2D424547494E20": "application/x-pem-file", // "-----BEGIN "

  // Archives / containers
  "504B0304": "application/zip",      // PK..
  "504B0506": "application/zip",
  "504B0708": "application/zip",
  "377ABCAF271C": "application/x-7z-compressed", // 7z
  "526172211A0700": "application/x-rar-compressed", // RAR v4 (partial)
  "526172211A070100": "application/x-rar-compressed", // RAR v5
  "1F8B08": "application/gzip",
  "FD377A585A00": "application/x-xz",
  "1F9D": "application/x-compress",   // compress (.Z) legacy
  "425A6839": "application/x-bzip2",  // BZh9 (bzip2)

  // Common archives/installer formats
  "4D5A": "application/x-msdownload", // MZ - EXE / DLL / PE
  "7F454C46": "application/x-elf",    // ELF binaries
  "4F676753": "application/ogg",      // Ogg ('OggS')
  "664C6143": "audio/flac",           // FLAC 'fLaC'

  // Audio
  "494433": "audio/mpeg",             // ID3 tag (MP3)
  "FFFB": "audio/mpeg",               // MPEG audio frame (common)
  "FFF3": "audio/mpeg",
  "FFF2": "audio/mpeg",
  "57415645": "audio/wav",            // 'WAVE' (but normally with RIFF at 0)

  // Video / containers
  "1A45DFA3": "video/x-matroska",     // Matroska / WebM
  "3026B2758E66CF11": "video/x-ms-wmv", // ASF / WMV (GUID header)
  "000001BA": "video/mpeg",           // MPEG Program stream (MPEG PS)
  "000001B3": "video/mpeg",           // MPEG Video
  "00000100": "video/mpeg",           // MPEG systems / PS variants

  // Fonts
  "00010000": "font/ttf",             // TrueType (often starts 00 01 00 00)
  "4F54544F": "font/otf",             // 'OTTO' OpenType
  "774F4646": "font/woff",            // wOFF: "wOFF"
  "774F4632": "font/woff2",           // wOF2: "wOF2"

  // Database / data formats
  "53514C69746520666F726D6174203300": "application/vnd.sqlite3", // "SQLite format 3\0"
  "4C000000": "application/x-little-endian-db", // some DBs (placeholder)

  // Image/photography raw formats (common starting bytes)
  "4949": "image/x-raw",               // generic little-endian raw (e.g., some RAW files)
  "42434954": "image/x-raw",           // 'BCIT' placeholder - many RAW vary by vendor

  // Adobe / design
  "41524348": "application/arc",        // ARC (older archive)

  // Microsoft Office legacy compound file (OLECF)
  "D0CF11E0A1B11AE1": "application/vnd.ms-office", // OLE Compound File (doc/xls/ppt legacy)
  
  // HTML/XML (text files) - often no magic bytes, but can start with '<' or '<?xml'
  "3C3F786D6C20": "application/xml",   // '<?xml '

  // Certificate / key files (PEM begins with dashes already)
  "2D2D2D2D2D425447": "application/x-pem-file",

  // Image/Vector special
  "255044462D312E": "application/pdf", // "%PDF-1." (more specific)
  "504B030414000600": "application/epub+zip", // EPUB is zip-based (needs extension or container checks)

  // Disk / Virtual disk formats
  "4B444E": "application/x-kdn",        // sample

  // Forensic / archive / misc frequently-used signatures
  "2321": "text/x-shellscript",         // #! (script)
  "255044462D": "application/pdf",

  // Misc/others - common small signatures
  "494E444558": "application/x-indexeddb", // example
  "7B5C7274": "application/json",       // placeholder (some text files)

  // Generic fallback signatures repeated intentionally for recognition
  "00000000": "application/octet-stream"
};


interface fileDetails extends file {
  url: SafeResourceUrl;
  type: string;
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
  user: { userId: string, userRole: string } | null = null;
  student: boolean = true;
  assignments: assignmentWithSubmissions[] = [];
  grades: grade[] = [];
  averageGrade: number = 0;
  courseId: string = "";
  courseName: string = "";
  users: user[]= [];

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
        this.user = userResponse as { userId: string, userRole: string };

        // If the user is not a student
        if (this.user.userRole !== "ff123156-7773-47f5-b5df-0ef54f864f8d") {
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

          const type = this.detectMimeFromBytes(byteArray);
          const blob = new Blob([byteArray], { type: type });

          (fileItem as fileDetails).url = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${type};base64,${fileItem.file}`);
          (fileItem as fileDetails).type = type;
          console.log("Detected file type:", type);
          console.log("File URL:", (fileItem as fileDetails).url);
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

    // Create the grade using the CourseService
    this.courses.createGradeForAssignment(this.courseId, this.user!.userId, this.submissionId, grade).subscribe(response => {
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

  // Get the type of a file from its byte array
  detectMimeFromBytes(bytes: Uint8Array): string {
    const hex = [...bytes]
      .map(b => b.toString(16).padStart(2, "0").toUpperCase())
      .join("");

    for (const sig in FILE_SIGNATURES) {
      if (hex.startsWith(sig)) {
        return FILE_SIGNATURES[sig];
      }
    }

      return "application/octet-stream"; // fallback
  }
}


