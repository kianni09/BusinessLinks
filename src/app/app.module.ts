import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }   from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { MainComponent } from './main/main.component';
import { ActionWindowComponent } from './title/action-window/action-window.component';
import { ListComponent } from './main/messenger/list/list.component';
import { DialogueComponent } from './main/messenger/dialogue/dialogue.component';
import { AddWindowComponent } from './main/messenger/add-window/add-window.component';
import { LoaderComponent } from './addictions/loader/loader.component';
import { MessengerComponent } from './main/messenger/messenger.component';
import { MenuComponent } from './main/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    MainComponent,
    ActionWindowComponent,
    ListComponent,
    DialogueComponent,
    AddWindowComponent,
    LoaderComponent,
    MessengerComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ClickOutsideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
