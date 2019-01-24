import { Component, OnInit, OnDestroy, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { Agency, Applicant, StatePaymentMethod} from '../../models';
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { StaticDataService } from '../../services/static-data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogueComponent } from '../dialogue/dialogue.component';

@Component({
  selector: 'confirm-enrollment',
  templateUrl: './confirm-enrollment.component.html',
  styleUrls: ['./confirm-enrollment.component.css']
})
export class ConfirmEnrollmentComponent implements OnInit, OnDestroy {

  applicant: Applicant;
  agency: Agency;
  brand: string;
  formattedNumber: string;
  stateCode: string;
  enrollmentConfirmed: boolean;
  enrollmentComplete: boolean;
  enrollmentErrorMessage: string;
  captchaConfirmed: boolean;
  confirmationError: boolean;
  confirmationTest: boolean;
  captchaResponse: string;
  price: number;
  generalInfo: any;
  subs: Subscription[] = [];
  paymentDescription: string;
  mailingAddress: string;
  paymentMethod: StatePaymentMethod;
  emailContent: string;

  constructor(public dataService: DataService,
    private enrollmentService: EnrollmentService,
    private stepperService: StepperService,
    private staticDataService: StaticDataService,
    private route: ActivatedRoute,
    private router: Router,
    public windowService: WindowService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.agency = this.enrollmentService.getAgency();
    this.applicant = this.enrollmentService.getApplicant();
    this.getPaymentMethods();
    this.getEmailContent();
    this.getMailingAddress(this.agency.stateCode);
    this.enrollmentComplete = this.enrollmentService.applicantEnrollmentComplete;
    if(this.applicant && this.applicant.payment && this.enrollmentService.fingerPrintCardUser) this.getMailingAddress(this.agency.stateCode);
    if(this.applicant && this.applicant.payment && this.applicant.payment.creditCard) this.setBrand(this.applicant.payment.creditCard.cardType);
    if(this.applicant && this.applicant.payment && this.applicant.payment.creditCard) this.formatCreditCardNumber(this.applicant.payment.creditCard.cardNumber);
    this.dataService.setRouteData(this.route.snapshot.data);
    if(this.applicant.confirmation && !this.enrollmentService.applicantChanged()) {
      this.enrollmentComplete = true;
      this.enrollmentConfirmed = true;
    }
    if(!this.enrollmentService.applicantChanged()) this.enrollmentService.applicantEnrolled.next(true);
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  reviewEnrollment() {
    if(this.applicant && this.applicant.confirmation) this.router.navigate(['/applicant-review']);
  }

  openDialog(type: string) {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        dialogueType: 'cancel'
      };

      if(this.windowService.width > 720) {
        dialogConfig.width = '600px';
      } else {
        dialogConfig.width = '80vw';
      }

      const dialogRef = this.dialog.open(DialogueComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        data => {
          if(data.continue) {
            if(this.enrollmentService.applicantEnrollmentComplete) {
              this.enrollmentService.resetApplicant();
              this.router.navigate(['/applicant-review']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      );
  }

  formatCreditCardNumber(number: string) {
    if(number) this.formattedNumber = '*' + number.substring(number.length - 4, number.length)
  }

  getMailingAddress(stateCode: string) {
    this.subs.push(this.dataService.getMailingAddress(stateCode)
    .subscribe(response=> {
      this.mailingAddress = response.result;
    }, err=> {
      console.log(err)
    }));
  }

  getEmailContent() {
    this.subs.push(this.dataService.getEmailContent()
    .subscribe(response=> {
      this.emailContent = response.result;
    }, err=> {
      console.log(err)
    }));
  }

  getPaymentMethods() {
    this.subs.push(this.dataService.getPaymentMethods(this.agency.stateCode)
    .subscribe(response=> {
      this.paymentMethod = response.result;
      let method = this.paymentMethod.paymentMethods[this.applicant.payment.paymentMethod];
      let type = this.applicant.payment.paymentType ? method[method.indexOf(this.applicant.payment.paymentType)] : null;
      this.paymentDescription = type ? type : this.applicant.payment.paymentMethod;
    }, err=> {
      console.log(err);
    }));
  }

  goToPreviousStep() {
    this.stepperService.goToPreviousStep();
  }

  print() {
    window.print();
  }

  setBrand(cardType: string) {
    if(cardType) this.brand = cardType.toLowerCase()
  }

  toggleCaptcha(event: any) {
    /* reCaptcha null on fail */
    this.captchaResponse = event ? event : null;
    this.captchaConfirmed = this.captchaResponse ? true : false;
  }

  confirmEnrollment() {
    this.enrollmentService.applicantProcessing.next(true);
    this.subs.push(this.enrollmentService.submitEnrollment(this.applicant, this.captchaResponse)
    .subscribe(response=> {
      this.applicant = response.result;
      this.enrollmentConfirmed = true;
      this.confirmationError = false;
      this.enrollmentService.saveApplicant(this.applicant, true);
      this.enrollmentService.saveLoadedApplicant(response.result);
      this.enrollmentService.applicantEnrolled.next(true);
      this.scrollAppAnchorIntoView();
      this.enrollmentService.applicantProcessing.next(false);
    }, err=> {
      console.log(err)
      this.confirmationError = true;
      this.enrollmentErrorMessage = err.message;
      this.enrollmentService.applicantProcessing.next(false);
      timer(500).subscribe(()=> this.windowService.error.next(err));
    }));
  }

  updateEnrollment() {
    this.enrollmentService.applicantProcessing.next(true);
    this.subs.push(this.enrollmentService.updateEnrollment(this.applicant, this.captchaResponse)
    .subscribe(response=> {
      this.applicant = response.result;
      this.enrollmentConfirmed = true;
      this.confirmationError = false;
      this.enrollmentService.saveApplicant(this.applicant, true);
      this.enrollmentService.saveLoadedApplicant(response.result);
      this.enrollmentService.applicantEnrolled.next(true);
      this.scrollAppAnchorIntoView();
      this.enrollmentService.applicantProcessing.next(false);
    }, err=> {
      console.log(err)
      this.confirmationError = true;
      this.enrollmentErrorMessage = err.message;
      this.enrollmentService.applicantProcessing.next(false);
      timer(500).subscribe(()=> this.windowService.error.next(err));
    }));
  }

  /* Since Divs are fixed make sure the app div scrolls to top router navigate */
  scrollAppAnchorIntoView() {
    let anchor = document.querySelector('.naps-enrollment-top-anchor');
    if(anchor) anchor.scrollIntoView();
  }

}
