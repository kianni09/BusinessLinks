import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MainService } from '../../../main.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Message, Dialogue } from '../../../main.models';
import { LocationStrategy } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.scss'],
})
export class DialogueComponent implements OnInit, OnDestroy {
  constructor(private mainService: MainService) {
  }

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
          this.mainService.selectedDialogue = dialogue;
          this.mainService
            .getMessages$(dialogue.dialogueID)
            .subscribe((messages: Message[]) => {
              console.log(messages);
              this.messages = messages;
              this.loadMessages = false;
              this.messagesSubscribe$ = this.mainService
                .echoMessages$(dialogue.dialogueID)
                .subscribe((message: Message) => {
                  console.log(message);
                  this.messages.unshift(message);
                  if (message.sender != this.sender)
                    this.mainService.dialogueRead(message.dialogueID);
                });
            });
        }
      }
    );
  }

  public loadMessages: boolean = false;

  ngOnDestroy(): void {
    if (this.dialogueSubscribe$) this.dialogueSubscribe$.unsubscribe();
    this.dialogueClose();
  }

  get sender() {
    return this.mainService.user.login;
  }

  get dialogue(): Dialogue {
    return this.mainService.selectedDialogue;
  }

  get usersOnline(): string[] {
    return this.mainService.usersOnline;
  }

  public isUserOnline(userNickname: string): boolean {
    return this.usersOnline.includes(userNickname);
  }

  public messages: Message[] = [];

  public message: string = '';
  public onSend: boolean = false;

  public inputHeight: number = 25;
  public getInputHeight(widthInput: number, widthMessage: number): void {
    let k: number = +((widthMessage + 45) / widthInput).toString().split('.')[0]
    let lineHeight = 25
    if (k < 1) {
      this.inputHeight = lineHeight;
    } else {
      this.inputHeight = k < 4 ? lineHeight * (k + 1) : lineHeight * 5;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeHandler(event: KeyboardEvent) {
    this.dialogueClose();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterHandler(event: KeyboardEvent) {
    this.sendMessage();
  }

  private innerWidth: any;
  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  public dialogueClose() {
    if (this.messagesSubscribe$) this.messagesSubscribe$.unsubscribe();
    this.mainService.isDialogueSelected = false;
    this.mainService.dialoguiesList.forEach((dialogue) => {
      dialogue.selected = false;
    });
    setTimeout(
      () => {
        this.message = '';
        this.inputHeight = 25;
        this.messages = [];
        this.mainService.selectedDialogueID = '';
        this.mainService.selectedDialogue$.next(null);
        this.mainService.selectedDialogue = null;
      },
      this.innerWidth <= 840 ? 450 : 0
    );
  }

  public fileName: string = null;
  public fileData: File = undefined;

  public onFileSelect(event) {
    let fileSize = event.target.files[0].size; // in bytes
    let maxSize = 5242880;
    if (fileSize > maxSize) {
      alert('File size is more than 5 MB');
    } else {
      this.fileName = event.target.files[0].name;
      this.fileData = event.target.files[0]
      this.message = this.fileName;
    }
  }

  public fileUnselect() {
    this.fileName = null;
    this.message = ''
    this.fileData = undefined;
  }

  public upload(data: Message) {
    const formData: any = new FormData();
    formData.append('message', JSON.stringify(data));
    formData.append("filedata", this.fileData, data.filePath);
    return this.mainService.fileUpload(formData);
  }

  public sendMessage() {
    if (this.message.length === 0) {
      return;
    }
    let message: Message = {
      type: this.fileData ? 'file' : 'text',
      date: new Date(),
      sender: this.sender,
      answerID: '',
      dialogueID: this.dialogue.dialogueID,
      text: this.message
    };
    this.onSend = true;
    this.message = '';
    this.inputHeight = 25;
    if (this.fileData) {
      this.mainService.fileReserve({ dialogueID: message.dialogueID, name: message.text }).subscribe(
        (path: any) => {
          message = { ...message, filePath: path.result };
          this.upload(message).subscribe((result) => {
            if (result) {
              setTimeout(() => {
                this.fileUnselect();
                this.onSend = false;
              }, 700);
            }
          });
        }
      )
    } else {
      this.mainService.newMessage$(message).subscribe((result: boolean) => {
        if (result) {
          setTimeout(() => {
            this.fileUnselect();
            this.onSend = false;
          }, 700);
        }
      });
    }
  }

  public fileDownload(path: string) {
    window.open('http://95.181.178.7:1313/dialogue/message-file-download/' + path);
  }


}
