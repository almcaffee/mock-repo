import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ApplicantInformationComponent } from './components/applicant-information/applicant-information.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { FingerprintComponent } from './components/fingerprint/fingerprint.component';
import { PaymentInformationComponent } from './components/payment-information/payment-information.component';
import { ConfirmEnrollmentComponent } from './components/confirm-enrollment/confirm-enrollment.component';
import { ApplicantSearchComponent } from './components/applicant-search/applicant-search.component';
import { ApplicantReviewComponent } from './components/applicant-review/applicant-review.component';
import { StepGuard } from './core/guards/step.guard';
import { DashboardGuard } from './core/guards/dashboard.guard';
import { FaqComponent } from './components/faq/faq.component';
import { ForgotConfirmationComponent } from './components/forgot-confirmation/forgot-confirmation.component';

export const AppRoutes: Routes = [
  {
    path: '*',
    component: LandingComponent,
    data: {
      header: 'Welcome'
    }
  },
  {
    path: 'applicant-information',
    component: ApplicantInformationComponent,
    canActivate: [StepGuard],
    data: {
      cancelDialogue: true,
      header: 'Applicant Enrollment',
      stepper: true
    }
  },
  {
    path: 'applicant-review',
    pathMatch: 'full',
    component: ApplicantReviewComponent,
    canActivate: [DashboardGuard],
    data: {
      header: 'Applicant Dashboard'
    }
  },
  {
    path: 'applicant-search',
    component: ApplicantSearchComponent,
    data: {
      header: 'Search'
    }
  },
  {
    path: 'confirm-enrollment',
    component: ConfirmEnrollmentComponent,
    canActivate: [StepGuard],
    data: {
      cancelDialogue: true,
      header: 'Applicant Enrollment',
      stepper: true
    }
  },
  {
    path: 'payment-information',
    component: PaymentInformationComponent,
    canActivate: [StepGuard],
    data: {
      cancelDialogue: true,
      header: 'Applicant Enrollment',
      stepper: true
    }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      cancelDialogue: true,
      header: 'Applicant Enrollment',
      stepper: true
    }
  },
  {
    path: 'fingerprinting',
    component: FingerprintComponent,
    canActivate: [StepGuard],
    data: {
      cancelDialogue: true,
      header: 'Applicant Enrollment',
      stepper: true
    }
  },
  {
    path: 'faq/:id',
    component: FaqComponent,
    data: {
      cancelDialogue: false,
      header: 'Frequently Asked Questions',
      stepper: false
    }
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      cancelDialogue: false,
      header: 'Frequently Asked Questions',
      stepper: false
    }
  },
  {
    path: 'forgot',
    component: ForgotConfirmationComponent,
    data: {
      cancelDialogue: false,
      header: 'Send Confirmation Details',
      stepper: false
    }
  },
  {
    path: '**',
    component: LandingComponent,
    data: {
      header: 'Welcome'
    }
  }
];
