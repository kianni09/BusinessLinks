import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { MainService } from '../../main.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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

  get dialoguiesList () {
    return this.mainService.dialoguiesList;
  }

  public dialogueSelect (index: number, id: string) {
    this.mainService.dialoguiesList.forEach((dialogue) => {
      dialogue.selected = false;
    });
    this.mainService.isDialogueSelected = true;
    this.mainService.dialoguiesList[index].selected = true;
    this.mainService.selectedDialogueID = id;
    this.mainService.selectedDialogue$.next(this.mainService.dialoguiesList[index]);
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
