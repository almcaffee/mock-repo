import { DataService } from './services/data.service';
import { StepperService } from './components/stepper/stepper.service';
import { StaticDataService } from './services/static-data.service';
import { EnrollmentService } from './services/enrollment.service';
import { WindowService } from './services/window.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './core/http/request-interceptors';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

import { mockBackendProvider } from './core/testing/mock-backend';

export const AppProviders: any[] = [
  DataService,
  WindowService,
  StepperService,
  StaticDataService,
  EnrollmentService,
  // mockBackendProvider, // Uncomment to run with mock ba
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
  },
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6LdHnGYUAAAAAEbxb6HBGsYByGC-rEboBlfKU-5l',
    } as RecaptchaSettings
}];
