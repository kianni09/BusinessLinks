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
  public messagesSubscribe$: Subscription = undefined;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.dialogueSubscribe$ = this.mainService.selectedDialogue$.subscribe(
      (dialogue) => {
        if (this.messagesSubscribe$) this.messagesSubscribe$.unsubscribe();
        if (dialogue) {
          this.loadMessages = true;
          console.log(dialogue);
          this.dialogue = dialogue;
          this.mainService
            .getMessages$(dialogue.dialogueID)
            .subscribe((messages: Message[]) => {
              console.log(messages);
              this.messages = messages;
              this.loadMessages = false;
              this.messagesSubscribe$ = this.mainService.echoMessages$(dialogue.dialogueID).subscribe(
                (message: Message) => {
                  console.log(message);
                  this.messages.unshift(message);
                }
               )
            });
        }
      }
    );
  }

  public loadMessages: boolean = false;

  ngOnDestroy(): void {
    this.dialogueSubscribe$.unsubscribe();
    this.dialogueClose();
  }

  get sender() {
    return this.mainService.user.login;
  }

  public dialogue: Dialogue = undefined;
  public messages: Message[] = [];

  public message: string = '';
  public onSend: boolean = false;

  public sendMessage() {
    if (this.message.length === 0) {
      return;
    }
    this.onSend = true;
    let message: Message = {
      type: 'text',
      date: new Date(),
      sender: this.sender,
      answerID: '',
      dialogueID: this.dialogue.dialogueID,
      text: this.message,
    };
    this.message = '';
    this.mainService.newMessage$(message).subscribe((result: boolean) => {
      if (result) {
        setTimeout(() => {
          this.onSend = false;
        }, 700);
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.dialogueClose();
  }

  private innerWidth: any;
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  public dialogueClose() {
    this.messagesSubscribe$.unsubscribe();
    this.mainService.isDialogueSelected = false;
    this.mainService.dialoguiesList.forEach((dialogue) => {
      dialogue.selected = false;
    });
    setTimeout(
      () => {
        this.dialogue = undefined;
        this.messages = [];
        this.mainService.selectedDialogue$.next(null);
      },
      this.innerWidth <= 840 ? 450 : 0
    );
  }
}
