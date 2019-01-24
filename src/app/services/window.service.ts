import { ApplicationRef, ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

function _window(): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
/* Keep a reference to the window as a sevice so we dont need to keep querying for it */
export class WindowService implements OnDestroy {

  mobile: boolean;
  touchDevice: boolean
  window: any;
  width: number;
  API_URL: string;

  winResizeWidth = new Subject<any>();
  winResizeWidthSub$ = this.winResizeWidth.asObservable();

  /* Function call destroys a listner after use */
  winScroll: Function;
  winResize: Function;

  error = new Subject<any>();
  errorSub$ = this.error.asObservable();

  constructor(private appRef: ApplicationRef) {
    this.window = _window();
    this.winScroll = this.window.window.addEventListener('scroll', ()=> this.setVariables());
    this.winResize = this.window.window.addEventListener('resize', ()=> this.setVariables(true));
    this.setVariables();
  }

  /* Clear memory of subscriptions */
  ngOnDestroy() {
    this.winScroll();
    this.winResize();
  }

  get nativeWindow(): any {
    return _window();
  }

  setVariables(resize?: boolean) {
    /* Test domain for sat/dev environment */
    let subDomain = this.window.document.domain.substr(this.window.document.domain.indexOf('.') + 1);
    if(this.window.location.hostname === 'localhost') {
      this.API_URL = 'https://dev.my-applicant-process.com';
    } else {
      this.API_URL = this.window.location.origin;
    }
    /* Does a simple user Agent info test to determine if the user is on a mobile device */
    this.mobile = (/Mobi/.test(this.window.navigator.userAgent) && this.window.innerWidth <= 1024) || this.window.innerWidth < this.window.innerHeight  ? true : false;
    /* Checks touch points to determine touchscreen - use for swiping menu if future */
    this.touchDevice = this.window.navigator.maxTouchPoints > 0 || this.window.navigator.msMaxTouchPoints > 0 ? true : false;
    this.width = this.window.innerWidth;
    if(resize) this.winResizeWidth.next(this.width);
  }

}
