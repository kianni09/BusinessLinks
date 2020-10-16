import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User, loginForm, registrationForm, Login, UserID } from './main.models';


@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {
    this.UserLoad();
  }

  private UserLoad() {
    if (localStorage.getItem('BusinessLinksUserID')) {
      let UserID: UserID = { userID: localStorage.getItem('BusinessLinksUserID')};
      this.http.post( environment.getUser, UserID ).subscribe( (user: User) => {
        this.loginSucces(user);
      } ); 
    } else {
      this.router.navigate(['title']);
    }
  }

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
    localStorage.setItem('BusinessLinksUserID', user.userID);
    this.router.navigate(['main']);
  }

  public selectedDialogue$ = new BehaviorSubject<any>(null);
  public isDialogueSelected: boolean = false;
  public dialoguiesList = [
    {
      firstName: "Test",
      secondName: "User",
      login: "testuser",
      selected: false
    }
  ]


  public exit () {
    this.user = undefined;
    localStorage.removeItem('BusinessLinksUserID');
    this.router.navigate(['title']);
  }

}
