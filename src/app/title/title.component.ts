import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';


@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  get closeAnimation () {
    return this.mainService.closeLandingWindowAnimation;
  }

  get windowAction () {
    return this.mainService.landingWindowAction;
  }

  public openActionWindow(type: string) {
    this.mainService.loginWindow = type === 'login';
    this.mainService.landingWindowAction = true;
  }
}
