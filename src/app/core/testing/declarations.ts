import { AppComponent } from '../../app.component';
import { LandingComponent } from '../../components/landing/landing.component';
import { PrivacyComponent } from '../../components/privacy/privacy.component';
import { ApplicantInformationComponent } from '../../components/applicant-information/applicant-information.component';
import { StepperComponent } from '../../components/stepper/stepper.component';
import { FingerprintComponent } from '../../components/fingerprint/fingerprint.component';
import { PaymentInformationComponent } from '../../components/payment-information/payment-information.component';
import { ConfirmEnrollmentComponent } from '../../components/confirm-enrollment/confirm-enrollment.component';
import { ApplicantSearchComponent } from '../../components/applicant-search/applicant-search.component';
import { ApplicantReviewComponent } from '../../components/applicant-review/applicant-review.component';
import { AddressInlinePipe } from '../../pipes/address-inline.pipe';
import { SensitiveInfoPipe } from '../../pipes/sensitive-info.pipe';
import { DialogueComponent } from '../../components/dialogue/dialogue.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { MethodPipe } from '../../pipes/method.pipe';
import { ForgotConfirmationComponent } from '../../components/forgot-confirmation/forgot-confirmation.component';


export const TestDeclarations: any[] = [
  AppComponent,
  LandingComponent,
  PrivacyComponent,
  ApplicantInformationComponent,
  StepperComponent,
  FingerprintComponent,
  PaymentInformationComponent,
  ConfirmEnrollmentComponent,
  AddressInlinePipe,
  ApplicantSearchComponent,
  ApplicantReviewComponent,
  SensitiveInfoPipe,
  DialogueComponent,
  FaqComponent,
  MethodPipe,
  ForgotConfirmationComponent
];

export const EntryComponents: any[] = [
  DialogueComponent
];
