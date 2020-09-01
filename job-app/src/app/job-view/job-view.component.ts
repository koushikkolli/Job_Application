import { Component, OnInit, Input} from '@angular/core';
import {JobDetails} from "../jobdetails.model"
import { Router, ActivatedRoute, CanActivate } from '@angular/router';
import { JobDetailsService } from '../jobdetails.service';
import {Params} from '@angular/router';
import { AuthService } from '../auth/auth.service';;

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {
  index: number;
  jobTitle: string;
  company: string;
  location: string;
  date: string;
  applyURL: string;
  source: string;
  description: string;
  additionalDetails: string;
  isLoggedIn = false;
  constructor(private route: ActivatedRoute, private jobDetailsService: JobDetailsService,
    private authService:AuthService, private routerService: Router) { 
    
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params)=>{
      if(params["index"]){
        this.index = params["index"];
        const jobdetails: JobDetails = this.jobDetailsService.getJob(this.index);
        console.log(jobdetails)
        this.jobTitle = jobdetails.jobTitle;
        this.company = jobdetails.company;
        this.location = jobdetails.location;
        this.date = jobdetails.date;
        this.applyURL = jobdetails.applyURL;
        this.description = jobdetails.description;
        this.source = jobdetails.source;
        this.additionalDetails = jobdetails.additionalDetails
        console.log(this.jobTitle)
        console.log(this.index)
      }
      
    });
    this.authService.user.subscribe((user)=>{
      this.isLoggedIn = !!user
  });
  }

  onLogin(){
    console.log("login called")
    this.routerService.navigate([0, 'auth']);
  }

  onBack(){
    console.log("login called")
    this.routerService.navigate(['job-lists']);
  }

}
