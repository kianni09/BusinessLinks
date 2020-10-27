import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MainService } from '../main.service';


@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.user) this.mainService.makeUserOffline();
  }

  @HostListener('window:unload')
  ifBrowserClose () {
    if (this.user) this.mainService.makeUserOffline();
  }

  get user () {
    return this.mainService.user;
  }

  get isDialogueSelected () {
    return this.mainService.isDialogueSelected;
  }

  get closeAnimation () {
    return this.mainService.closeAddDialogueWindowAnimation;
  }

  get windowAction () {
    return this.mainService.addDialogueWindowAction;
  }

}
