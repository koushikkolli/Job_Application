import { Injectable } from '@angular/core';
import { JobDetails } from './jobdetails.model'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class JobDetailsService {
  listChanged = new Subject<JobDetails[]>();
  listOfJobs: JobDetails[] = [];

  getJobs() {
    return this.listOfJobs;
  }

  getJob(index: number) {
    return this.listOfJobs[index]
  }

  deleteJob(index: number) {
    this.listOfJobs.splice(index, 1)
  }
  addJob(jobDetails: JobDetails) {
    this.listOfJobs.push(jobDetails)
  }

  setJobs(jobDetails: JobDetails[]) {
    console.log("set jobs called")
    console.log(jobDetails)
    this.listOfJobs =  this.listOfJobs.concat(jobDetails);
    console.log(this.listOfJobs)
    this.listChanged.next(this.listOfJobs);
  }

  resetJobs(){
    this.listOfJobs = [];
  }

}