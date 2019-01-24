import { DataService } from '../../services/data.service';
import { StepperService } from '../../components/stepper/stepper.service';
import { StaticDataService } from '../../services/static-data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { StepGuard } from '../guards/step.guard';
import { DashboardGuard } from '../guards/dashboard.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from '../http/request-interceptors';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { APP_BASE_HREF } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';
import { mockBackendProvider } from './mock-backend';

export const TestProviders: any[] = [
  DataService,
  WindowService,
  StepperService,
  StaticDataService,
  EnrollmentService,
  StepGuard,
  DashboardGuard,
  mockBackendProvider,
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6LerimAUAAAAAFaU0Gauo3UnAp6U-zhd04mVHfql',
    } as RecaptchaSettings
  },
  { provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: {} },
  { provide: APP_BASE_HREF, useValue: '/' },
  { provide: ChangeDetectorRef, useValue: {} }
];
