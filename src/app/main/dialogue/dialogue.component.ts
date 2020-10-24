import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MainService } from '../../main.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Message, Dialogue } from '../../main.models';

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
          this.mainService.getMessages$(dialogue.dialogueID).subscribe( (messages: Message[]) => {
            console.log(messages);
            this.messages = messages;

          } )
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.dialogueSubscribe$.unsubscribe();
    this.dialogueClose();
  }

  get sender () {
    return this.mainService.user.login;
  }

  public dialogue: Dialogue = undefined;
  public messages: Message[] = [];

  public message: string = "";
  public onSend: boolean = false;

  public sendMessage() {
    if (this.message.length === 0) {
      return
    }
    this.onSend = true;
    let message: Message = {
      type: "text",
      date: new Date(),
      sender: this.sender,
      answerID: "",
      dialogueID: this.dialogue.dialogueID,
      text: this.message
    }
    this.mainService.newMessage$(message).subscribe( (result: boolean) => {
      if (result) {
        setTimeout( () => {
          this.message = "";
          this.onSend = false;
        }, 700 )
        
      }
    } );
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.dialogueClose();
  }

  public dialogueClose() {
    this.mainService.isDialogueSelected = false;
    this.dialogue = undefined;
    this.messages = [];
    this.mainService.selectedDialogue$.next(null);
    this.mainService.dialoguiesList.forEach((dialogue) => {
      dialogue.selected = false;
    });
  }
}
