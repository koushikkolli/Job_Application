import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostJob } from '../postjob.model';
import { DataStorageService } from '../data-storage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css'],
})
export class PostJobComponent implements OnInit {
  postJobForm: FormGroup;
  // country: string = null;
  // companyName: string = null;
  // jobTitle: string = null;
  // address: string = null;
  // city: string = null;
  // state: string = null;
  // zipCode: string = null;
  // jobType: string = null;
  // salary: string = null;
  // numberOfPositions: string = null;
  // description: string = null;
  // companyWebsite: string = null;
  // companyFb: string = null;
  // modeOfApplication: string = null;
  // reciveApplication: string = null;
  // education: string = null;
  // experience: string = null;
  // postJob: PostJob;
  constructor(
    private dataStorageService: DataStorageService,
    private routerService: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.postJobForm = new FormGroup({
      //conntry: new FormControl(this.country, Validators.required),
      companyName: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
      //address: new FormControl(this.address, Validators.required),
      city: new FormControl('', Validators.required),
      // state: new FormControl(this.state, Validators.required),
      // zipCode: new FormControl(this.zipCode, Validators.required),
      // jobType: new FormControl(this.jobType, Validators.required),
      // salary: new FormControl(this.salary, Validators.required),
      // numberOfPositions: new FormControl(this.numberOfPositions, Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      // companyWebsite: new FormControl(this.companyWebsite),
      // companyFb: new FormControl(this.companyFb),
      // modeOfApplication: new FormControl(this.modeOfApplication, Validators.required),
      // reciveApplication: new FormControl(this.reciveApplication, Validators.required),
      // education : new FormControl(this.education, Validators.required),
      // experience: new FormControl(this.experience, Validators.required),
    });
  }
  onSumbit() {
    const postJob = new PostJob(
      '1',
      this.postJobForm.value.country,
      this.postJobForm.value.companyName,
      this.postJobForm.value.jobTitle,
      this.postJobForm.value.address,
      this.postJobForm.value.city,
      this.postJobForm.value.state,
      this.postJobForm.value.zipCode,
      this.postJobForm.value.jobType,
      this.postJobForm.value.salary,
      this.postJobForm.value.numberOfPositions,
      this.postJobForm.value.description,
      this.postJobForm.value.companyWebsite,
      this.postJobForm.value.companyFb,
      this.postJobForm.value.modeOfApplication,
      this.postJobForm.value.reciveApplication,
      this.postJobForm.value.education,
      this.postJobForm.value.experience,
      new Date()
    );

    console.log(postJob);

    this.dataStorageService.storeData(postJob);
  }

  onCancel() {
    this.routerService.navigate(['job-lists']);
  }
}
