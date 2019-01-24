import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WindowService } from '../../services/window.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private inj: Injector, private windowService: WindowService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.inj.get(AuthService);
    const headers = authService.getBaseHeader();
    const headReq = req.clone({ headers: headers});
    return next.handle(headReq);
  }
}
