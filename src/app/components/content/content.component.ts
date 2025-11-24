import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, content, course } from '../../services/course.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  contentList: (content & { expanded: boolean })[] = [];
  course: course | undefined;
  courseId: string = '';

  constructor(private route: ActivatedRoute, private courseService: CourseService, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Get the course ID
      this.courseId = params['id'];

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

  getAllContent(): void {
    this.courseService.getAllContentByCourseId(this.courseId).subscribe((response) => {
        if (!Array.isArray(response)) {
          console.error('Expected an array of content but received:', response);
          return;
        }

        // Store the content list
        this.contentList = response.map(item => ({ ...item, expanded: false }));
      });
  }


  // Toggle a certain content
  toggleContent(content: content & { expanded?: boolean }): void {
    // Collapse all other contents and toggle the selected one
    this.contentList.forEach(w => {
      if (w === content) {
        w.expanded = !w.expanded;
      } else {
        w.expanded = false;
      }
    });
  }
}