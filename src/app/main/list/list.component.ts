import { Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'dialoguies-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  get user () {
    return this.mainService.user;
  }

  get dialoguiesList () {
    return this.mainService.dialoguiesList;
  }

  public dialogueSelect (index: number) {
    this.mainService.isDialogueSelected = true;
    this.mainService.dialoguiesList[index].selected = true;
    this.mainService.selectedDialogue$.next(this.mainService.dialoguiesList[index]);
  }



  public exit () {
    this.mainService.exit();
  }

}
