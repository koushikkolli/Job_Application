import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {JobDetails} from "../jobdetails.model"
import { JobDetailsService } from '../jobdetails.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  @Input() job: JobDetails;
  @Input() index: number;
  //@Output() deleteClicked = new EventEmitter<number>();
  isLoggedIn = false;
  constructor(private jobDetailsService: JobDetailsService, private authService:AuthService
    ,private routerService: Router) { }

  ngOnInit(): void {
    
    this.authService.user.subscribe((user)=>{
      this.isLoggedIn = !!user
  });

  
  }
  onDelete(){
    this.jobDetailsService.deleteJob(this.index)
  }

  onViewJob(){
    console.log("view called")
    this.routerService.navigate([this.index, 'job-view']);
  }

}
