import { JobDetails } from './jobdetails.model';
import { Injectable } from '@angular/core';
import { JobDetailsService } from './jobdetails.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SearchDetails } from './serachdetails.model';
import { PostJob } from './postjob.model';
import { from } from 'rxjs';

const SERVER_URL: string = 'api/';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private jobDetailsService: JobDetailsService,
    private http: HttpClient
  ) {}

  
  storeData(postJob: PostJob) {
    console.log('storeData()');
    this.http
      .post('https://job-portal-fa501.firebaseio.com/postJobs.json', [postJob])
      .subscribe((res) => {
        console.log(res);
      });
  }

  fetchDataIndeed(searchDetail: SearchDetails) {
    this.http
      .post('http://127.0.0.1:5000/fetch_indeed', searchDetail)
      .pipe(
        tap((jobdetails: JobDetails[]) => {
          this.jobDetailsService.setJobs(jobdetails);
        })
      )
      .subscribe();
  }

  fetchDataDoccafe(searchDetail: SearchDetails) {
    this.http
      .post('http://127.0.0.1:5000/fetch_doccafe', searchDetail)
      .pipe(
        tap((jobdetails: JobDetails[]) => {
          this.jobDetailsService.setJobs(jobdetails);
        })
      )
      .subscribe();
  }

  fetchDataLinkedin(searchDetail: SearchDetails) {

    this.http
      .post<JobDetails[]>('http://127.0.0.1:5000/fetch_linkedin', searchDetail)
      .pipe(
        tap((jobdetails: JobDetails[]) => {
          this.jobDetailsService.setJobs(jobdetails);
        })
      )
      .subscribe();
  }

  filter(str: string) {}
}
