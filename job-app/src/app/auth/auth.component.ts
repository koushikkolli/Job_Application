import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  error: string;
  isLoginMode = true;
  jobIndex: number;
  constructor(
    private authService: AuthService,
    private routerService: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.jobIndex = params['jobIndex'];
      console.log(this.jobIndex);
    });

    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onLogin() {
    this.isLoginMode = true;
    this.onSubmit();
  }
  onSignUp() {
    this.routerService.navigate(['sign-up']);
  }
  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObs: Observable<AuthResponseData>;
    this.error = null;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password, true);
    }
    authObs.subscribe(
      (response) => {
        if (this.jobIndex) {
          console.log("Checkpoint 1");
          this.location.back();
        } else {
          this.routerService.navigate(['job-lists']);
        }
      },
      (errorMessage) => {
        this.error = errorMessage;
      }
    );
  }
}
