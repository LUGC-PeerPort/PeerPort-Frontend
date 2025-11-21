import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService, content} from '../../services/course.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-content',
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  WEEKS: content[] | undefined;
  weekId: string | undefined;
  title: string | undefined;
  isOpen: boolean | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  
  User: {userId: string} | null = null;
  userId: string | undefined;

  constructor(private route: ActivatedRoute, private CourseService: CourseService){}
  

   


  ngOnInit(): void {
    this.route.params.subscribe(params => {
     
      this.CourseService.getAllContentByCourseId(params['id']).subscribe(response => { 
        this.WEEKS = response as content[];
        
      })
    });
  }

}
