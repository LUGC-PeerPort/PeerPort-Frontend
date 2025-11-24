import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { course, CourseService } from '../../services/course.service';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-course',
  imports: [RouterLink],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {

  course: course | undefined;
  courseId: string | undefined;
  name: string | undefined;
  courseCode: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  constructor(private route: ActivatedRoute, private CourseService: CourseService, private dataService: DataService){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.CourseService.getCourseById(params['id']).subscribe(response => {
        this.course = response;
      })
      this.dataService.changeMessage(params['id']);
    });
  }
}
