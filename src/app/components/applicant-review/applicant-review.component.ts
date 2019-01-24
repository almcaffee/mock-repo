import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { StepperService } from '../stepper/stepper.service';
import { Applicant, Agency, SiteLocation, FaqResult } from '../../models';
import { Observable, Subscription } from 'rxjs';
import { WindowService } from '../../services/window.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogueComponent } from '../dialogue/dialogue.component';

@Component({
  selector: 'app-applicant-review',
  templateUrl: './applicant-review.component.html',
  styleUrls: ['./applicant-review.component.css']
})
export class ApplicantReviewComponent implements OnInit, OnDestroy {

  applicant: Applicant;
  agency: Agency;
  status: string;
  applicantFound: boolean;
  cols: any;
  faqs: FaqResult[] = [];
  brand: string;
  formattedNumber: string;
  generalInfo: any = {};
  stateCode: string;
  subs: Subscription[] = [];

  constructor(private dataService: DataService,
    private enrollmentService: EnrollmentService,
    private router: Router,
    public dialog: MatDialog,
    private stepperService: StepperService,
    public windowService: WindowService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getFaqs();
    this.dataService.setRouteData(this.route.snapshot.data);
    if(this.enrollmentService.applicantEnrollmentComplete) {
      let applicant = this.enrollmentService.getApplicant();
      // https://dev.my-applicant-process.com/applicant-api/swagger-ui.html#/applicant-controller/queryUsingPOST
      if(applicant) {
        this.setApplicant(applicant);
        this.applicantFound = true;
        this.agency = this.enrollmentService.getAgency();
        this.status = this.formatStatus(applicant.status)
        if(!this.agency) this.getAgency(this.applicant.stateCode, this.applicant.transaction.reviewingAgencyId);
        this.stepperService.completeSteps();
      } else {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate(['/applicant-search']);
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe);
  }

  goToStep(stepRoute: string) {
    this.stepperService.goToStep(stepRoute);
  }

  getAgency(stateCode: string, agencyId: string) {
    this.subs.push(this.dataService.getAgency(stateCode, agencyId)
    .subscribe(response=> {
      let agency = response.result;
        this.enrollmentService.setAgency(agency);
        this.enrollmentService.applicantProcessing.next(false);
        localStorage.setItem('agency', JSON.stringify(agency));
        this.router.navigate(['/applicant-review']);
    }, err=> {
      /* Are we displaying error message */
      console.log(err)
    }));
  }

 getFaqs() {
   this.subs.push(this.dataService.getFaq()
   .subscribe(faqs=> {
     this.faqs = faqs;
   }, err=> {
     console.log(err)
   }));
 }

 formatCreditCardNumber(number: string) {
   this.formattedNumber = '*' + number.substring(number.length - 4, number.length);
 }

 formatStatus(statusStr: string): string {
   if(statusStr) {
     statusStr = statusStr.toLowerCase();
     let status = statusStr.split('_');
     for (var i = 0; i < status.length; i++) {
      status[i] = status[i].charAt(0).toUpperCase() + status[i].slice(1);
     }
     return status.join(' ');
   } else {
     return null;
   }
 }

 openDialog(type: string) {
     const dialogConfig = new MatDialogConfig();

     dialogConfig.disableClose = true;
     dialogConfig.autoFocus = true;
     dialogConfig.data = {
       dialogueType: type
     };

     if(type === 'confirmation') {
       dialogConfig.data['applicant'] = this.applicant;
       dialogConfig.data['agency'] = this.agency;
     }

     if(type != 'confirmation' && this.windowService.width > 720) {
       dialogConfig.width = '600px';
     } else if(type != 'confirmation') {
       dialogConfig.width = '80vw';
     }

     const dialogRef = this.dialog.open(DialogueComponent, dialogConfig);

     dialogRef.afterClosed().subscribe(
         data => {
           if(data.continue && type === 'home') {
             this.router.navigate(['/']);
           } else if(data.continue) {
             this.enrollmentService.applicantProcessing.next(true);
             this.enrollmentService.deleteEnrollment()
             .subscribe(response=> {
               this.enrollmentService.applicantProcessing.next(false);
               this.router.navigate(['/']);
             }, err=> {
               console.log(err)
             });
           }
       }
     );
 }

 setApplicant(applicant: Applicant) {
   if(applicant) {
     this.applicant = applicant;
     this.applicantFound = true;
     this.stateCode = applicant.stateCode;
     if(applicant.payment && applicant.payment.creditCard && applicant.payment.creditCard.cardType) this.setBrand(applicant.payment.creditCard.cardType);
     if(applicant.payment && applicant.payment.creditCard && applicant.payment.creditCard.cardNumber) this.formatCreditCardNumber(applicant.payment.creditCard.cardNumber);
   }
  }

  setBrand(cardType: string) {
    this.brand = cardType.toLowerCase();
  }

}
