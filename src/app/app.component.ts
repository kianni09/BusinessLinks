import { Component } from '@angular/core';
import { MainService } from './main.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'businesslinks';
  constructor (private mainService: MainService) {

  }

  get preLoad (): boolean {
    return this.mainService.preLoad;
  }

  get preLoadClose (): boolean {
    return this.mainService.preLoadClose;
  }
}
