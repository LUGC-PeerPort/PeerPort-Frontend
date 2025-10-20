import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = environment.courseApi;

  private usernameSource = new BehaviorSubject<string | null>(null);
  username = this.usernameSource.asObservable();

  setUsername(username: string): void {
    this.usernameSource.next(username);
  }
  clearUsername(): void {
    this.usernameSource.next(null);
  }

  constructor(private http: HttpClient) { }

  //gets user id
  currentUser(){
    return this.http.get(`${this.apiUrl}/auth/currentUser`);
  }

  //logs out user
  logout(){
    return this.http.get(`${this.apiUrl}/auth/logout`);
  }

}
