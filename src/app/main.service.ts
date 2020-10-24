import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  User,
  loginForm, registrationForm, Login, UserID, Dialogue, DialogueRAW, DialogueAdd, Message
} from './main.models';
import * as io from 'socket.io-client';


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

  private url = 'http://95.181.178.7:1313';
  private socket = io(this.url, { transport: ['websocket'] });

  private UserLoad() {
    if (localStorage.getItem('BusinessLinksUserID')) {
      let UserID: UserID = { userID: localStorage.getItem('BusinessLinksUserID') };
      this.http.post(environment.getUser, UserID).subscribe((user: User) => {
        this.loginSucces(user);
      });
    } else {
      this.router.navigate(['title']);
    }
  }

  private dialoguesSubscriber$: Subscription;
  public echoDialogues$(userID: string) {
    return Observable.create((observer) => {
      this.socket.on('dialogues-' + userID , (result: string) => {
        observer.next(result);
      });
    });
  }

  public landingWindowAction: boolean = false;
  public closeLandingWindowAnimation: boolean = false;
  public loginWindow: boolean = true;

  public user: User;

  public loginCheck$(data: Login) {
    return this.http.post(environment.loginCheck, data);
  }

  public userRegistration$(data: registrationForm) {
    return this.http.post(environment.registration, data);
  }

  public userLogin$(data: loginForm) {
    return this.http.post(environment.login, data);
  }

  public loginSucces(user: User) {
    this.user = user;
    console.log(user);
    this.dialoguesSubscriber$ = this.echoDialogues$(user.userID).subscribe( (data: DialogueRAW[]) => {
      this.dialoguiesList = data.map( (item: DialogueRAW) => {
        return { selected: item.dialogueID === this.selectedDialogueID, ...item }
      } ).sort( (a, b) => {
        if (a.lastMessage.date > b.lastMessage.date) {
          return -1;
        }
        if (a.lastMessage.date < b.lastMessage.date) {
          return 1;
        }
        return 0;
      } );
    } )
    this.getDialogues({userID: user.userID})
    localStorage.setItem('BusinessLinksUserID', user.userID);
    this.router.navigate(['main']);
  }

  public exit() {
    this.user = undefined;
    localStorage.removeItem('BusinessLinksUserID');
    this.router.navigate(['title']);
  }

  public selectedDialogue$ = new BehaviorSubject<Dialogue>(null);
  public selectedDialogueID: string = "";
  public isDialogueSelected: boolean = false;
  public dialoguiesList: Dialogue[] = [];

  public async getDialogues(userID: UserID) {
    this.http.post(environment.getDialogues, userID).subscribe((data: DialogueRAW[]) => {
      this.dialoguiesList = data.map( (item: DialogueRAW) => {
        return { selected: item.dialogueID === this.selectedDialogueID, ...item }
      } ).sort( (a, b) => {
        if (a.lastMessage.date > b.lastMessage.date) {
          return -1;
        }
        if (a.lastMessage.date < b.lastMessage.date) {
          return 1;
        }
        return 0;
      } );

    })
  }

  public deleteDialogue$ (id) {
    return this.http.post( environment.deleteDialogues, id )
  }

  public createDialogue$(info: DialogueAdd) {
    return this.http.post( environment.createDialogues, info );
  }

  public addDialogueWindowAction: boolean = false;
  public closeAddDialogueWindowAnimation: boolean = false;
  public addDialogueWindow: boolean = true;

  public getMessages$(dialogueID: string) {
    return this.http.post(environment.getMessages, {dialogueID: dialogueID});
  }

  public newMessage$(message: Message) {
    return this.http.post(environment.newMessage, message);
  }


}
