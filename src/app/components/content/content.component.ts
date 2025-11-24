import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, content, course, file } from '../../services/course.service';
import { DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { detectMimeFromBytes } from "../grade/grade.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface fileDetails extends file {
  url: SafeResourceUrl;
}

interface contentWithFiles extends content {
  files: fileDetails[];
  expanded: boolean;
  subContent: contentWithFiles[];
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, NgTemplateOutlet, DatePipe],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  // Variables
  contentList: contentWithFiles[] = [];
  course: course | undefined;
  courseId: string = "";
  student: boolean = true;
  user: { userId: string, roleId: string } | undefined;

  // For editing content
  name: string = "";
  description: string = "";
  viewable: string = "true";
  contentId: string = "";
  activity: Function = () => {};
  selectedFiles: File[] = [];
  Math = Math;
  create: boolean = false;

  

  constructor(
    private sanitizer: DomSanitizer, 
    private route: ActivatedRoute, 
    private courseService: CourseService, 
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Get the course ID
      this.courseId = params['id'];

      // Get the user
      this.authService.currentUser().subscribe((userData) => {
        this.user = userData;
        if (userData.roleId !== "ff123156-7773-47f5-b5df-0ef54f864f8d") {
          this.student = false;
        }
      });

      // Get the course details
      this.courseService.getCourseById(this.courseId).subscribe((course: any) => {
        this.course = course;
      });

      // Notify other components about the course change
      this.dataService.changeMessage(this.courseId);

      // Get the content for the course
      this.getAllContent();
    });
  }

  // Get all the content
  getAllContent(): void {
    this.courseService.getAllContentByCourseId(this.courseId).subscribe((response) => {
      if (!Array.isArray(response)) {
        console.error('Expected an array of content but received:', response);
        return;
      }

      // Process each content item
      this.contentList = response.map((content): contentWithFiles => { 
        return this.parseData(content);
      });
    });
  }

  // Parse the content data to include file URLs
  parseData(content: content): contentWithFiles {
    const newContent = { ...content } as contentWithFiles;

    // Check if there are subContent and parse them recursively
    if (newContent.subContent && newContent.subContent.length > 0) {
      newContent.subContent = newContent.subContent.map((subContentItem): contentWithFiles => this.parseData(subContentItem));
    }

    // Parse the files
    newContent.files = content.files.map((fileItem: file) => {
      const byteChars = atob(fileItem.file);
      const byteNumbers = new Array(byteChars.length);

      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const type = detectMimeFromBytes(byteArray);

      // Make the url trusted as its coming from us
      const newFile = fileItem as fileDetails;
      newFile.url = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${type};base64,${fileItem.file}`);
      return newFile;
    });
    newContent.expanded = false;

    return newContent;
  }


  // Toggle a certain content
  toggleContent(content: content & { expanded?: boolean }): void {
    // Collapse all other contents and toggle the selected one
    content.expanded = !content.expanded;
  }

  loadData(content: content): void {
    this.name = content.name;
    this.description = content.description || "";
    this.viewable = content.viewable ? "true" : "false";
    this.contentId = content.contentId;

    this.activity = this.editContent;
  }

  // Create content
  createContent(): void {
    const files = this.selectedFiles;

    const formData = new FormData();

    // Append each selected file as a separate 'files' entry so the backend receives a list
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      }
    }

    // Add the rest of the content data
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('viewable', this.viewable);

    // Update the content
    this.courseService.createNewContentAttachedToSpecificCourse(this.contentId, formData).subscribe(() => {
      // Refresh the content list after update
      this.getAllContent();
    });
  }
  // Edit content
  editContent(): void {
    const files = this.selectedFiles;

    const formData = new FormData();

    // Append each selected file as a separate 'files' entry so the backend receives a list
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      }
    }

    // Add the rest of the content data
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('viewable', this.viewable);

    // Update the content
    this.courseService.editCourseContentFromSpecificCourse(this.contentId, formData).subscribe(() => {
      // Refresh the content list after update
      this.getAllContent();
    });
  }

  // Delete content
  deleteContent(contentId: string): void {
    this.courseService.deleteContent(contentId).subscribe(() => {
      // Refresh the content list after deletion
      this.getAllContent();
    });
  }

  // Handle file selection
  onFilesSelected(files: FileList | null): void {
    if (files) {
      const data = Array.from(files);
      for (let file of data) {
        this.selectedFiles.push(file);
      }
      console.log(this.selectedFiles);
    }
  }
}