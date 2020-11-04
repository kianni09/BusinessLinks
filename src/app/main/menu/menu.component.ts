import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';


@Component({
  selector: 'menu-label',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  get menuStatus (): boolean {
    return this.mainService.menuStatus;
  }

  public menuAction(): void {
    this.mainService.menuStatus = !this.mainService.menuStatus;
  }

  public menuOff(): void {
    this.mainService.menuStatus = false;
  }

  get user () {
    return this.mainService.user;
  }

  public exit () {
    this.mainService.exit();
  }

}
