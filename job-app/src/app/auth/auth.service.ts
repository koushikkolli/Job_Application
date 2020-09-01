import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string; 
  email: string;
  refreshToken: string; 
  expiresIn: string;
  localId: string;
  displayName: string;
  registered?: boolean;
}
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string, isEmployer: boolean) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          'AIzaSyCMKaGqC3LU6uK7NpTImErCu85edxzo5kQ',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthenticaion(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn,
            responseData.displayName
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + 
         'AIzaSyCn9jWEt920Rjnl03EvBDt35Li32RrfVvM',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          console.log(responseData);
          this.handleAuthenticaion(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn,
            responseData.displayName
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
  }
  
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    console.log(errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email aready used";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email is invalid";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This password is invalid";
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthenticaion(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number,
    displayName: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expirationDate,displayName);
    this.user.next(user);
    localStorage.setItem("userData", JSON.stringify(user));
  }
}
