import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import type { user, error } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  apiUrl: string = environment.courseApi;

  constructor(private http: HttpClient) { }

  //gets user id
  currentUser(){
    return this.http.get<{ userId: string, roleId: string }>(`${this.apiUrl}auth/currentUser`, {withCredentials: true});
  }

  // Gets all users
  getAllUsers() {
    return this.http.get<user[] | error>(`${this.apiUrl}users`, {withCredentials: true});
  }
}
