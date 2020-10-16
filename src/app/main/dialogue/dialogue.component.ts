import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MainService } from '../../main.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.scss'],
})
export class DialogueComponent implements OnInit, OnDestroy {
  constructor(private mainService: MainService) {}

  public dialogueSubscribe$: Subscription = undefined;

  ngOnInit(): void {
    this.dialogueSubscribe$ = this.mainService.selectedDialogue$.subscribe(
      (dialogue) => {
        if (dialogue) {
          console.log(dialogue);
          this.dialogue = dialogue;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.dialogueSubscribe$.unsubscribe();
    this.dialogueClose();
  }

  public dialogue = undefined;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.dialogueClose();
  }

  public dialogueClose() {
    this.mainService.isDialogueSelected = false;
    this.dialogue = undefined;
    this.mainService.selectedDialogue$.next(null);
    this.mainService.dialoguiesList.forEach((dialogue) => {
      dialogue.selected = false;
    });
  }
}
