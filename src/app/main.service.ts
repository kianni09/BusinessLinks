import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  User,
  loginForm,
  registrationForm,
  Login,
  UserID,
  Dialogue,
  DialogueRAW,
  DialogueAdd,
  Message,
} from './main.models';
import * as io from 'socket.io-client';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private notificator: NotificationsService
  ) {
    this.UserLoad();
    this.notificator.requestPermission();
  }

  private url = 'http://95.181.178.7:1313';
  private socket = io(this.url, { transport: ['websocket'] });

  public preLoad: boolean = false;
  public preLoadClose: boolean = false;

  private UserLoad() {
    if (localStorage.getItem('BusinessLinksUserID')) {
      this.preLoad = true;
      let UserID: UserID = {
        userID: localStorage.getItem('BusinessLinksUserID'),
      };
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
      this.socket.on('dialogues-' + userID, (result: string) => {
        observer.next(result);
      });
    });
  }

  private usersActionsSubscriber$: Subscription;
  public echoUsersActions$() {
    return Observable.create((observer) => {
      this.socket.on('user-actions', (result: string) => {
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

  public usersOnline: string[] = [];
  public usersOnline$(data: string[]) {
    return this.http.post(environment.usersOnline, {userCurrent: this.user.login, usersNicknames: data});
  }

  public getUsersOnline() {
    if (this.dialoguiesList.length > 0) {
      let nicknames = [...this.dialoguiesList.map((dialogue: Dialogue) => {
        return dialogue.nickname;
      })]
      console.log(nicknames)
      this.usersOnline$(nicknames).subscribe((result: string[]) => {
        console.log(result);
        this.usersOnline = result;
      });
    }
  }

  public makeUserOffline() {
    this.socket.emit('leaveSystem', this.user.login);
  }

  public loginSucces(user: User) {
    this.user = user;
    console.log(user);
    this.usersActionsSubscriber$ = this.echoUsersActions$().subscribe((result: string) => {
      console.log(result);
      this.getUsersOnline();
    })
    this.socket.emit('enterSystem', user.login);
    this.dialoguesSubscriber$ = this.echoDialogues$(user.userID).subscribe(
      (data: DialogueRAW[]) => {
        this.dialoguiesList = data
          .map((item: DialogueRAW) => {
            let dialogue: Dialogue = {
              selected: item.dialogueID === this.selectedDialogueID,
              ...item,
            }
            if (dialogue.selected) this.selectedDialogue = dialogue;
            return dialogue;
          })
          .sort((a, b) => {
            if (a.lastMessage.date > b.lastMessage.date) {
              return -1;
            }
            if (a.lastMessage.date < b.lastMessage.date) {
              return 1;
            }
            return 0;
          });
        if (this.dialoguiesList.some((dialogue: Dialogue) => {
          return !dialogue.lastMessage.isRead && dialogue.lastMessage.sender != this.user.login;
        })) {
          this.notificator
            .create$('Colloq', {
              body: 'У вас є нові повідомлення!',
              icon: '../assets/img/logo.png',
            })
            .subscribe();
        }
        this.getUsersOnline();
      }
    );
    this.getDialogues({ userID: user.userID });
    localStorage.setItem('BusinessLinksUserID', user.userID);
    this.router.navigate(['main']);
    this.preLoadClose = true;
    setTimeout( () => {
      this.preLoad = false;
      this.preLoadClose = false;
    }, 590 );

  }

  public exit() {
    this.makeUserOffline();
    this.user = undefined;
    this.dialoguesSubscriber$.unsubscribe();
    localStorage.removeItem('BusinessLinksUserID');
    this.router.navigate(['title']);
  }

  public selectedDialogue$ = new BehaviorSubject<Dialogue>(null);
  public selectedDialogue: Dialogue = null;
  public selectedDialogueID: string = '';
  public isDialogueSelected: boolean = false;
  public dialoguiesList: Dialogue[] = [];

  public async getDialogues(userID: UserID) {
    this.http
      .post(environment.getDialogues, userID)
      .subscribe((data: DialogueRAW[]) => {
        this.dialoguiesList = data
          .map((item: DialogueRAW) => {
            return {
              selected: item.dialogueID === this.selectedDialogueID,
              ...item,
            };
          })
          .sort((a, b) => {
            if (a.lastMessage.date > b.lastMessage.date) {
              return -1;
            }
            if (a.lastMessage.date < b.lastMessage.date) {
              return 1;
            }
            return 0;
          });
        this.getUsersOnline();
      });
  }

  public deleteDialogue$(id) {
    return this.http.post(environment.deleteDialogues, id);
  }

  public createDialogue$(info: DialogueAdd) {
    return this.http.post(environment.createDialogues, info);
  }

  public addDialogueWindowAction: boolean = false;
  public closeAddDialogueWindowAnimation: boolean = false;
  public addDialogueWindow: boolean = true;

  public getMessages$(dialogueID: string) {
    return this.http.post(environment.getMessages, { dialogueID: dialogueID });
  }

  public newMessage$(message: Message) {
    return this.http.post(environment.newMessage, message);
  }

  public echoMessages$(dialogueID: string) {
    return Observable.create((observer) => {
      this.socket.on('messages-' + dialogueID, (result: string) => {
        observer.next(result);
      });
    });
  }

  public dialogueRead(dialogueID: string) {
    this.socket.emit('dialogueRead', dialogueID);
  }
}
