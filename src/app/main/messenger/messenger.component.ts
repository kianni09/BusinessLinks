import { Component, OnInit, HostListener } from '@angular/core';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
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
