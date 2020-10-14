import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { loginForm, registrationForm } from '../../main.models';

@Component({
  selector: 'action-window',
  templateUrl: './action-window.component.html',
  styleUrls: ['./action-window.component.scss'],
})
export class ActionWindowComponent implements OnInit {
  constructor(private mainService: MainService) {}

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
  };

  public inputSection: boolean = true;
  public isLoad: boolean = false;

  get isLogin() {
    return this.mainService.loginWindow;
  }

  public action (type: string) {
    this.isLoad = true;
    if (type === 'login') {
      setTimeout(() => {
        this.isLoad = false;
      }, 1600);
    } else {
      setTimeout(() => {
        this.isLoad = false;
      }, 1600);
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
