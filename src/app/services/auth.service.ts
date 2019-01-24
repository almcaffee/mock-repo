import { Inject, Injectable, Optional, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { WindowService } from './window.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  authenticated: boolean;

  constructor(private http: HttpClient, private win: WindowService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach(s=> s.unsubscribe());
  }

  getBaseHeader(): HttpHeaders {
    const header = new HttpHeaders({
      'Content-Type': 'application/json; text/plain'
    });
    return header;
  }

  getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getAuthentication().token
    });
    return headers;
  }

  getHeaders(): HttpHeaders {
    if(this.getAuthentication() && this.validateToken()) {
      return this.getAuthHeaders();
    } else {
      return this.getBaseHeader();
    }
  }

  getAuthentication(): any {
    return localStorage.getItem('authentication') ? JSON.parse(localStorage.getItem('authentication')) : null;
  }

  handleLogin(res: any) {
    if(res instanceof HttpErrorResponse) {
      this.handleError(res);
    } else {
      console.log(res.account)
    }
  }

  storeObject(name: string, obj: any) {
    localStorage.setItem(name, JSON.stringify(obj));
  }

  updateAuthentication(auth: any) {
    this.storeObject('authentication', auth);
  }

  validateToken() {
    return moment(this.getAuthentication().expires).isAfter(moment().second());
  }

  handleError(err: HttpErrorResponse, fn?: string) {
    console.log(err);
    if(fn) console.log(fn);
    console.log(err.error.toString());
  }

}
