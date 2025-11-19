import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

export class calendar{
    _id: string | undefined;
    date: string | undefined;
    taskDue: string | undefined;
}
@Component({
  selector: 'app-calendar',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

}
