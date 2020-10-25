import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }   from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { MainComponent } from './main/main.component';
import { ActionWindowComponent } from './title/action-window/action-window.component';
import { ListComponent } from './main/list/list.component';
import { DialogueComponent } from './main/dialogue/dialogue.component';
import { AddWindowComponent } from './main/add-window/add-window.component';
import { LoaderComponent } from './addictions/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    MainComponent,
    ActionWindowComponent,
    ListComponent,
    DialogueComponent,
    AddWindowComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
