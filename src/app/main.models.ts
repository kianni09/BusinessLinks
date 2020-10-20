export interface Login {
    login: string
}

export interface UserID {
    userID: string;
}

export interface loginForm {
    login: string;
    password: string;
}

export interface registrationForm {
    firstName: string;
    secondName: string;
    login: string;
    password: string;
    dialogues: string [];
}

export interface User {
    userID: string
    firstName: string;
    secondName: string;
    login: string;
    dialogues: string [];
}

export interface LastMessage{
  sender: string;
  date: Date;
  isRead: boolean;
}

export interface DialogueRAW  {
  dialogueID: string;
  firstName: string;
  secondName: string;
  nickname: string;
  lastMessage: LastMessage;
}

export interface Dialogue extends DialogueRAW {
  //fill(): void;
  selected: boolean;
}
