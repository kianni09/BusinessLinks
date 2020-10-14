import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  public landingWindowAction: boolean = false;
  public closeLandingWindowAnimation: boolean = false;
  public loginWindow: boolean = true;




}
