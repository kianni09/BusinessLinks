import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'menu-label',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private mainService: MainService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    console.log(this.path)
  }

  public menuHeaders = {
    messenger: "Зв'язки"
  }

  public goTo(location: string): void {
    this.router.navigate(['main/' + location]);
    this.menuOff();
  }

  get path(): string {
    return this.location.path().split('/')[2]
  }

  get menuStatus (): boolean {
    return this.mainService.menuStatus;
  }

  public menuBackBlock: boolean = false;
  public menuBackBlockHide: boolean = false;

  public switchMenuBlock (): void {
    if (this.mainService.menuStatus) {
      this.menuBackBlock = true
    } else {
      setTimeout(() => {
        this.menuBackBlockHide = true;
        setTimeout( () => {
          this.menuBackBlock = false;
          this.menuBackBlockHide = false;
        }, 200 )
      }, 200 )
    }
  }

  public menuAction(): void {
    this.mainService.menuStatus = !this.mainService.menuStatus;
    this.switchMenuBlock();
  }

  public menuOff(): void {
    this.mainService.menuStatus = false;
    this.switchMenuBlock();
  }

  get user () {
    return this.mainService.user;
  }

  public exit () {
    this.mainService.exit();
  }

}
