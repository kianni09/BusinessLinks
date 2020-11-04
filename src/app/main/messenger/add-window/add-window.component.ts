import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../main.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LastMessage, Dialogue, DialogueAdd } from '../../../main.models';

@Component({
  selector: 'add-dialogue-window',
  templateUrl: './add-window.component.html',
  styleUrls: ['./add-window.component.scss'],
})
export class AddWindowComponent implements OnInit {
  constructor(private mainService: MainService) {
    this.loginValidation$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((l: string) => {
        let login = l.replace('@', '');
        if (this.loginValidate(login)) {
          if (this.ifLoginInclude(login)) {
            this.loginValidationStatus = false;
            this.loginValidationMessage = 'Користувача вже додано';
          } else {
            this.mainService
              .loginCheck$({ login: login })
              .subscribe((result: boolean) => {
                console.log(result);
                if (!result === false) {
                  this.loginValidationStatus = true;
                  this.loginValidationMessage = '';
                } else {
                  this.loginValidationStatus = false;
                  this.loginValidationMessage = 'Користувача не знайдено';
                }
              });
          }
        } else {
          this.loginValidationStatus = false;
          this.loginValidationMessage = 'Некоректний логін';
        }
      });
  }

  ngOnInit(): void {}

  get user() {
    return this.mainService.user;
  }

  get dialogues() {
    return this.mainService.dialoguiesList;
  }

  public isLoad: boolean = false;
  public login: string = '';

  public loginValidation$ = new Subject<string>();
  public loginValidationStatus: boolean = false;
  public loginValidationMessage: string = null;
  public loginValidate(login: string): boolean {
    let re = /^[A-Za-z0-9]{4,17}$/;
    return re.test(login);
  }

  public ifLoginInclude(login: string) {
    return this.dialogues.some((dialogue) => {
      return dialogue.nickname === login;
    }) || this.user.login === login;
  }

  public action() {
    this.isLoad = true;
    let lastMessage: LastMessage = {
      sender: this.user.login,
      date: new Date(),
      isRead: false,
    };
    let dialogue: DialogueAdd = {
      userID: this.user.userID,
      targetLogin: this.login,
      lastMessage: lastMessage,
    };
    this.mainService.createDialogue$(dialogue).subscribe((result: boolean) => {
      console.log(result);
      if (result) {
        this.close();
      }
    });
  }

  public close() {
    this.mainService.closeAddDialogueWindowAnimation = true;
    setTimeout(() => {
      this.mainService.addDialogueWindowAction = false;
      this.mainService.closeAddDialogueWindowAnimation = false;
    }, 600);
  }
}
