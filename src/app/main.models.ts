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