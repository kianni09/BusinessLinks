import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { loginForm, registrationForm, User } from '../../main.models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'action-window',
  templateUrl: './action-window.component.html',
  styleUrls: ['./action-window.component.scss'],
})
export class ActionWindowComponent implements OnInit {
  constructor(private mainService: MainService) {
    this.loginValidation$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((login: string) => {
        if (this.loginValidate(login)) {
          this.mainService
            .loginCheck$({ login: login })
            .subscribe((result: boolean) => {
              console.log(result);
              if (result === false) {
                this.loginValidationStatus = true;
                this.loginValidationMessage = 'Логін доступний для реєстрації';
              } else {
                this.loginValidationStatus = false;
                this.loginValidationMessage = 'Логін вже використовується';
              }
            });
        } else {
          this.loginValidationStatus = false;
          this.loginValidationMessage = 'Некоректний логін';
        }
      });
  }

  ngOnInit(): void {}

  public logForm: loginForm = {
    login: '',
    password: '',
  };

  public regForm: registrationForm = {
    firstName: '',
    secondName: '',
    login: '',
    password: '',
    dialogues: [],
  };

  public loginValidation$ = new Subject<string>();
  public loginValidationStatus: boolean = false;
  public loginValidationMessage: string = null;
  public loginValidate(login: string): boolean {
    let re = /^[A-Za-z0-9]{4,17}$/;
    return re.test(login);
  }

  get passwordValidationStatus() {
    return this.regForm.password.length >= 6;
  }
  get passwordValidationMessage() {
    return this.passwordValidationStatus ? false : 'Некоректний пароль';
  }

  get registrationVerification() {
    return (
      this.regForm.firstName &&
      this.regForm.secondName &&
      this.passwordValidationStatus &&
      this.loginValidationStatus
    );
  }

  public registrationResult: boolean = false;

  public inputSection: boolean = true;
  public isLoad: boolean = false;

  get isLogin() {
    return this.mainService.loginWindow;
  }

  public unsuccesLogin: boolean = false;

  public action(type: string) {
    this.isLoad = true;
    if (type === 'login') {
      this.mainService.userLogin$(this.logForm).subscribe((user: User) => {
        if (user) {
          this.mainService.loginSucces(user);
        } else {
          this.isLoad = false;
          this.unsuccesLogin = true;
        }
      });
    } else {
      this.mainService
        .userRegistration$(this.regForm)
        .subscribe((result: boolean) => {
          this.inputSection = false;
          this.registrationResult = result;
        });
    }
  }

  public close() {
    this.mainService.closeLandingWindowAnimation = true;
    setTimeout(() => {
      this.mainService.landingWindowAction = false;
      this.mainService.closeLandingWindowAnimation = false;
    }, 600);
  }
}
