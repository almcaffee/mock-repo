import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatToolbarModule,
  MatCardModule,
  MatStepperModule,
  MatDatepickerModule,
  MatRadioModule,
  MatListModule,
  MatChipsModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';
import { MomentDateModule, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MarkdownModule } from 'ngx-markdown';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { AppRoutes } from '../../routes';

export const TestImports: any[] = [
  HttpModule,
  HttpClientTestingModule,
  BrowserModule,
  BrowserDynamicTestingModule,
  BrowserAnimationsModule,
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatToolbarModule,
  MatCardModule,
  MatStepperModule,
  MatDatepickerModule,
  MatRadioModule,
  MatMomentDateModule,
  MomentDateModule,
  MatListModule,
  MatChipsModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTableModule,
  MatTooltipModule,
  RouterTestingModule.withRoutes(AppRoutes),
  MarkdownModule.forRoot(),
  RecaptchaModule.forRoot(),
  RecaptchaFormsModule
];
