import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { MainService } from '../../../main.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LastMessage } from '../../../main.models';

@Component({
  selector: 'dialoguies-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterContentChecked {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {

  }

  get user () {
    return this.mainService.user;
  }

  get usersOnline (): string[] {
    return this.mainService.usersOnline;
  }

  public isUserOnline (userNickname: string): boolean {
    return this.usersOnline.includes(userNickname);
  }

  get dialoguiesList () {
    return this.mainService.dialoguiesList;
  }

  get selectedDialogueID () {
    return this.mainService.selectedDialogueID;
  }

  public isNewMessage( lastMessage: LastMessage ): boolean {
    return lastMessage.sender != this.user.login && !lastMessage.isRead;
  }

  public dialogueSelect (index: number, id: string, lastMessage: LastMessage) {
    this.mainService.dialoguiesList.forEach((dialogue) => {
      dialogue.selected = false;
    });
    this.mainService.isDialogueSelected = true;
    this.mainService.dialoguiesList[index].selected = true;
    this.mainService.selectedDialogueID = id;
    this.mainService.selectedDialogue$.next(this.mainService.dialoguiesList[index]);
    if (this.isNewMessage(lastMessage)) this.mainService.dialogueRead(id);
  }

  public openActionWindow() {
    this.mainService.addDialogueWindow = true;
    this.mainService.addDialogueWindowAction = true;
  }

  public delete (id: string) {
    this.mainService.deleteDialogue$({dialogueID: id}).subscribe(
      (result) => {
        console.log(result)
      }
     )
  }

  public exit () {
    this.mainService.exit();
  }

}
