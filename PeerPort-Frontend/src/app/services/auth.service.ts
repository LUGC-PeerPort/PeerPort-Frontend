import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
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

  register(user: any){
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  //Not currently implemented in backend - is currently hard coded
  login(user: any){
    return this.http.post(`${this.apiUrl}/users/login`, user, { withCredentials: true});
  }
  
  //same here
  logout(){
    return this.http.get(`${this.apiUrl}/users/logout`, { withCredentials: true });
  }
  
}
