import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, content } from '../../services/course.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  WEEKS: (content & { expanded?: boolean })[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        this.courseService.getAllContentByCourseId(courseId).subscribe(response => {
          // Initialize each week with collapsed state
          this.WEEKS = (response as content[]).map(week => ({
            ...week,
            expanded: false
          }));
        });
      }
    });
  }

  toggleWeek(week: content & { expanded?: boolean }): void {
    // Collapse all other weeks and toggle the selected one
    this.WEEKS.forEach(w => {
      if (w === week) {
        w.expanded = !w.expanded;
      } else {
        w.expanded = false;
      }
    });
  }
}