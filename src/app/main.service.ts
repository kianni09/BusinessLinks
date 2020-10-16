import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User, loginForm, registrationForm, Login } from './main.models';


@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  public landingWindowAction: boolean = false;
  public closeLandingWindowAnimation: boolean = false;
  public loginWindow: boolean = true;

  public user: User;

  public loginCheck$ (data: Login) {
    return this.http.post( environment.loginCheck, data );
  }

  public userRegistration$ (data: registrationForm) {
    return this.http.post( environment.registration, data );
  }

  public userLogin$ (data: loginForm) {
    return this.http.post( environment.login, data );
  }

  public loginSucces(user: User) {
    this.user = user;
    console.log(user);
    this.router.navigate(['main']);
  }




}
