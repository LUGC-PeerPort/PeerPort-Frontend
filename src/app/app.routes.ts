import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { GradeComponent } from './components/grade/grade.component';
import { ContentComponent } from './components/content/content.component';
import { ClassListComponent } from './components/class-list/class-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'home/course/:id', component: CourseComponent},
    {path: 'home/course/:id/assignments', component: AssignmentComponent},
    {path: 'grades', component: GradeComponent},
    {path: 'calendar', component: CalendarComponent},
    {path: 'content', component: ContentComponent},
    {path: 'classList', component: ClassListComponent}
];
