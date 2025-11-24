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
  selectedFiles: File[] = [];
  Math = Math;
  create: boolean = false;
  parentId: string | undefined;


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

      // Process incoming content items into parsed objects
      const incoming = response.map((content): contentWithFiles => this.parseData(content));

      // Merge incoming into existing list (update fields, add new items, keep others)
      this.contentList = this.mergeContentLists(this.contentList, incoming);
    });
  }

  // Merge two content lists: update existing items, add new ones, do not remove items
  private mergeContentLists(existing: contentWithFiles[], incoming: contentWithFiles[]): contentWithFiles[] {
    if (!existing || existing.length === 0) {
      // nothing to merge with, return incoming as-is
      return incoming.slice();
    }

    // Create a map for existing items by id for quick lookup
    const existingMap = new Map<string, contentWithFiles>();
    for (const it of existing) {
      if (it.contentId) existingMap.set(it.contentId, it);
    }

    // For each incoming, if exists update fields, else add
    for (const inc of incoming) {
      if (!inc.contentId) {
        // no id; skip merging, push as new
        existing.push(inc);
        continue;
      }

      const found = existingMap.get(inc.contentId);
      if (found) {
        this.updateContentFields(found, inc);
      } else {
        existing.push(inc);
      }
    }

    return existing;
  }

  // Update scalar fields, merge files and subContent recursively
  private updateContentFields(target: contentWithFiles, source: contentWithFiles): void {
    // Update scalar fields if changed
    target.name = source.name ?? target.name;
    target.description = source.description ?? target.description;
    target.viewable = source.viewable ?? target.viewable;
    target.dateCreated = source.dateCreated ?? target.dateCreated;
    target.dateUpdated = source.dateUpdated ?? target.dateUpdated;

    // Merge files: update existing files by id/name, add new ones
    target.files = this.mergeFiles(target.files || [], source.files || []);

    // Merge subContent recursively
    if (!target.subContent) target.subContent = [];
    if (source.subContent && source.subContent.length > 0) {

      // create map for target subcontent
      const subMap = new Map<string, contentWithFiles>();
      for (const s of target.subContent) if (s.contentId) subMap.set(s.contentId, s);
      for (const incChild of source.subContent) {
        if (!incChild.contentId) {
          target.subContent.push(incChild);
          continue;
        }

        const found = subMap.get(incChild.contentId);
        if (found) {
          this.updateContentFields(found, incChild);
        } else {
          target.subContent.push(incChild);
        }
      }
    }
  }

  // Merge files arrays without duplicating entries.
  private mergeFiles(existingFiles: fileDetails[], incomingFiles: fileDetails[]): fileDetails[] {
    // Make sure that the lists have content
    if (!existingFiles || existingFiles.length === 0) return incomingFiles.slice();
    if (!incomingFiles || incomingFiles.length === 0) return existingFiles.slice();

    const keyOf = (f: any) => f.fileId ?? f.id ?? f.fileName ?? f.name ?? '';

    const existingMap = new Map<string, fileDetails>();
    for (const f of existingFiles) existingMap.set(keyOf(f), f);

    for (const inc of incomingFiles) {
      const k = keyOf(inc);
      if (!k) {
        existingFiles.push(inc);
        continue;
      }

      const found = existingMap.get(k);
      if (found) {
        // update fields on existing file
        found.fileName = inc.fileName ?? found.fileName;
        found.file = inc.file ?? found.file;

        // update url if provided
        if ((inc as any).url) found.url = (inc as any).url;
      } else {
        existingFiles.push(inc);
      }
    }

    return existingFiles;
  }

  // Parse the content data to include file URLs
  private parseData(content: content): contentWithFiles {
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
    this.create = false;

    // Add the files to the selected files
    this.selectedFiles = content.files.map(f => {
      const byteChars = atob(f.file);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: detectMimeFromBytes(byteArray) });
      return new File([blob], f.fileName);
    });
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

    const finalize = () => {
      // Refresh the content list after update
      this.getAllContent();
      // reset create mode and form fields so user can open another parent's create immediately
      this.create = false;
      this.parentId = undefined;
      this.name = "";
      this.description = "";
      this.viewable = "true";
      this.selectedFiles = [];
    };

    if (this.parentId && this.create) {
      this.courseService.createSubContentForSpecificContent(this.parentId, formData).subscribe(() => {
        finalize();
      });
    } else {
      // Create the content attached to course (top-level or fallback)
      this.courseService.createNewContentAttachedToSpecificCourse(this.contentId, formData).subscribe(() => {
        finalize();
      });
    }
  }

  // Whenever create button is pressed
  createPressed(parentId: string): void {
    // If user clicked the same parent while create is open, toggle it closed.
    const normalizedParent = parentId == "" ? undefined : parentId;
    if (this.create && this.parentId === normalizedParent) {
      this.create = false;
      this.parentId = undefined;
      return;
    }

    // Open create form for the selected parent immediately
    this.create = true;
    this.parentId = normalizedParent;
    this.contentId = "";
    this.name = "";
    this.description = "";
    this.viewable = "true";
    this.selectedFiles = [];
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

  // Remove selected file
  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
}