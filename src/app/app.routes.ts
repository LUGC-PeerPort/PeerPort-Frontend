import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
 import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'course', component: CourseComponent},
    {path: 'assignments', component: AssignmentComponent},
     {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];
