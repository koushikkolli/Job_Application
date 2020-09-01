import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { JobComponent } from './job/job.component';
import { JobListsComponent } from './job-lists/job-lists.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth/auth.component';
import { PostJobComponent } from './post-job/post-job.component';
import {Routes, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { JobViewComponent } from './job-view/job-view.component'

const routes: Routes =[
  { path : "", redirectTo:"job-lists", pathMatch:'full'},
  { path : "auth", component: AuthComponent},
  { path : "post-job", component: PostJobComponent},
  { path : "applied-jobs", component: AppliedJobsComponent},
  { path : "job-lists", component: JobListsComponent},
  { path : "sign-up", component: SignupComponent},
  { path : ":index/job-view", component: JobViewComponent},
  { path : ":jobIndex/auth", component: AuthComponent},
  
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    JobComponent,
    JobListsComponent,
    AuthComponent,
    PostJobComponent,
    AppliedJobsComponent,
    JobViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
