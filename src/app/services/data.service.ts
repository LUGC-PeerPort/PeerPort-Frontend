import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string){
    this.messageSource.next(message);
  }

  private assignmentIdSource = new BehaviorSubject<string>('');
  currentAssignment = this.assignmentIdSource.asObservable();

  changeAssignmentId(message: string){
    this.assignmentIdSource.next(message);
  }
}
