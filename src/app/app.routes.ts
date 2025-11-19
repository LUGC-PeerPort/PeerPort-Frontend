import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { GradeComponent } from './components/grade/grade.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'course', component: CourseComponent},
    {path: 'assignments', component: AssignmentComponent},
    {path: 'grades', component: GradeComponent},
    {path: 'calendar', component: CalendarComponent}
];
