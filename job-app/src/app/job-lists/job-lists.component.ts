import { Component, OnInit } from '@angular/core';
import {JobDetails} from '../jobdetails.model'
import { JobDetailsService } from '../jobdetails.service'
import { SearchDetails } from '../serachdetails.model'
import { DataStorageService } from '../data-storage.service'
@Component({
  selector: 'app-job-lists',
  templateUrl: './job-lists.component.html',
  styleUrls: ['./job-lists.component.css']
})
export class JobListsComponent implements OnInit {
  listOfJobs: JobDetails[];
  keyWord = "";
  keyWhere = "";
  searchDetail: SearchDetails;
  constructor(private jobDetailsService: JobDetailsService, private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
    this.jobDetailsService.listChanged.subscribe((jobDetails: JobDetails[])=>{
      this.listOfJobs = jobDetails;
      });
      this.listOfJobs = this.jobDetailsService.getJobs();
      //this.dataStorageService.fetchIndeedJobs(this.searchDetails);
      
  }
  deleteJob(index: number){
    this.listOfJobs.splice(index,1);
  }

  onFindJobs(){
    this.searchDetail = new SearchDetails(this.keyWord, this.keyWhere);
    this.jobDetailsService.resetJobs();
    //this.dataStorageService.fetchDataDoccafe(this.searchDetail);
    //this.dataStorageService.fetchDataIndeed(this.searchDetail);
    console.log("FindJobs")
    this.dataStorageService.fetchDataLinkedin(this.searchDetail);
  }

}
