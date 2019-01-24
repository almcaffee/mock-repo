import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { StepperService } from '../stepper/stepper.service';
import { DataService } from '../../services/data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { Applicant, Agency, SiteLocation, PrintSite } from '../../models';
import { Subscription, Observable, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'fingerprint-options',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  applicant: Applicant;
  agency: Agency;
  pageSize: number = 7;
  pageIndex: number;
  locationAccepted: boolean;
  locations: PrintSite[] = [];
  subscriptions: Subscription[] = [];
  enrollmentComplete: boolean;
  fingerPrintCardUser: boolean;
  fingerPrintCardUserSelected: boolean;
  fingerPrintForm: FormGroup;
  paymentType: string;
  dataSource: MatTableDataSource<object>;
  displayedColumns: string[] = ['name', 'address', 'hours', 'link'];

  constructor(private stepperService: StepperService,
    private enrollmentService: EnrollmentService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public windowService: WindowService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getApplicant();
    this.getAgency();
    this.setupForm();
    this.populateSiteAcceptance();
    this.dataService.setRouteData(this.route.snapshot.data);
    this.enrollmentComplete = this.enrollmentService.applicantEnrollmentComplete;
    if(this.enrollmentComplete) this.locationAccepted = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s=> s.unsubscribe());
  }

  openDialog(type: string) {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        dialogueType: type
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
            if(type === 'cancel') {
              if(this.enrollmentService.applicantEnrollmentComplete) {
                this.router.navigate(['/applicant-review']);
              } else {
                this.router.navigate(['/']);
              }
            } else if(type === 'mailIn') {
              // this.locationAccepted = true;
              this.fingerPrintCardUser = true;
              this.fingerPrintCardUserSelected = true;
            }
          } else if(type === 'mailIn') {
            this.fingerPrintCardUser = false;
            this.fingerPrintCardUserSelected = true;
          }
        });
  }

  getApplicant() {
    let applicant = this.enrollmentService.getApplicant();
    if(applicant) {
      this.applicant = applicant;
      if(this.applicant.payment && this.applicant.payment.paymentMethod && this.applicant.payment.paymentMethod === 'MAIL_IN') {
        this.fingerPrintCardUser = true;
      }
    }
  }

  /* Get selected agency from privacy form in localstorage */
  getAgency() {
    let agency = this.enrollmentService.getAgency();
    if(agency) {
      this.agency = agency;
    }
  }

  getStateSiteLocations(stateCode: string) {
    this.subscriptions.push(this.dataService.getStateSiteLocations(stateCode)
    .subscribe(response=> {
      this.locations = this.setLocationData(response.result, stateCode);
      this.dataSource = new MatTableDataSource(this.locations);
      timer(200).subscribe(()=>  {
        this.dataSource.paginator = this.paginator;
        this.scrollAppAnchorIntoView();
      });
    }, err=> {
      console.log(err)
    }));
  }

  /* Call stepper service to go back a step */
  goToPreviousStep() {
    this.stepperService.goToPreviousStep();
  }

  populateSiteAcceptance() {
    /* Auto populate saved privacy data */
    let locationAccepted = localStorage.getItem('locationAccepted');
    if(locationAccepted) {
      this.locationAccepted = JSON.parse(locationAccepted);
    } else {
      this.locationAccepted = false;
    }
  }

  setAppointmentType(fingerPrintCardUser: boolean) {
    console.log('set appointment type')
    this.locationAccepted = false;
    if(fingerPrintCardUser === true) {
      console.log(true)
      this.dataSource = null;
      this.openDialog('mailIn');
    } else {
      console.log(false)
      this.fingerPrintCardUser = false;
      this.fingerPrintCardUserSelected = true;
      this.getStateSiteLocations(this.agency.stateCode);
    }
    this.setFee();
  }

  setFee() {
    if(this.applicant.id && this.applicant.payment) {
      let amount = this.fingerPrintCardUser ? this.applicant.transaction.reviewingAgencyServiceLevel.paperFee : this.applicant.transaction.reviewingAgencyServiceLevel.electronicFee;
      this.enrollmentService.setPaymentAmount(amount.toString());
    }
  }

  setupForm() {
    this.fingerPrintForm = new FormGroup({
      fingerPrintCardUser: new FormControl(null, Validators.required)
    });
    if(this.enrollmentService.fingerPrintCardUserSelected) {
      this.fingerPrintCardUser = this.enrollmentService.fingerPrintCardUser;
      this.fingerPrintCardUserSelected = true;
      this.fingerPrintForm.controls['fingerPrintCardUser'].patchValue(this.fingerPrintCardUser);
    } else if(this.applicant && this.applicant.id) {
      this.fingerPrintCardUser = this.applicant.payment.amount === this.applicant.transaction.reviewingAgencyServiceLevel.electronicFee ? false : true;
      this.fingerPrintCardUserSelected = true;
      this.fingerPrintForm.controls['fingerPrintCardUser'].patchValue(this.fingerPrintCardUser);
    }
    this.subscriptions.push(this.fingerPrintForm.controls['fingerPrintCardUser'].valueChanges.subscribe(fingerPrintCardUser=> {
      this.setAppointmentType(fingerPrintCardUser);
    }));
  }

  setLocationData(locations: PrintSite[], stateCode): PrintSite[] {
    let states = [{ stateCode: 'GA', name: 'Georgia'}, { stateCode: 'FL', name: 'Florida'}];
    let aOptions = ['University', 'Main', '17th', 'Concord', 'Jackson', 'Jewel', 'Braxton'];
    let a1Options = ['Suite', 'Building', 'Floor'];
    let aSOptions = ['Street', 'Road', 'Place', 'St.', 'Rd.', 'Pl.', 'Blvd.', 'Boulevard', 'Court', 'Ct.', 'Avenue', 'Ave.'];
    let cOptions = ['Macon', 'Gainsville', 'Huron', 'Cross City', 'Staples', 'Concord', 'Hopewell'];

    let stateLocations: PrintSite[] = [];
    locations.forEach(l=> {

      let aNum = Math.floor(Math.random() * (15001 - 112 + 1)) + 1;
      let aIndex = Math.floor(Math.random() * (aOptions.length - 2 + 1)) + 1;
      let aSOIndex = Math.round(Math.random());
      let aSIndex = Math.floor(Math.random() * (aSOptions.length - 2 + 1)) + 1;
      let a1Index = Math.floor(Math.random() * (a1Options.length - 2 + 1)) + 1;
      let cIndex = Math.floor(Math.random() * (cOptions.length - 2 + 1)) + 1;
      let z = Math.floor(Math.random() * (99999 - 10009 + 1)) + 1;
      let v = Math.floor(Math.random() * (999 - 2 + 1)) + 1;
      let sC = states.find(s=> s.stateCode === l.stateCode);
      let a2 = aSOIndex > 0 ? a1Options[a1Index]+' '+v : null;
      let a = aNum+' '+aOptions[aIndex]+' '+aSOptions[aSIndex];
      let w = aSOIndex > 0 ? a1Options[a1Index]+' '+v : null;

      l.address = {
        address1: a,
        address2: a2,
        city: cOptions[cIndex],
        state: sC.name,
        zip: z.toString()
      };
      l.companyWebSiteUrl = w ? 'http://www.'+l.name.split(' ').join('').split(';').join('').split('.').join('').toLowerCase()+'.com' : null;
      if(l.stateCode === stateCode) stateLocations.push(l);
    });

    return stateLocations;
  }

  scrollAppAnchorIntoView() {
    let anchor = document.querySelector('.naps-enrollment-top-anchor');
    if(anchor) anchor.scrollIntoView();
  }

  /* Click next after acceptance */
  submitEnrollmentForm() {
    localStorage.setItem('locationAccepted', JSON.stringify(this.locationAccepted));
    this.enrollmentService.setFingerprintCardUser(this.fingerPrintCardUser);
    this.stepperService.completeStep();
  }

  /* Show hide next button based on checked */
  toggleLocationAcceptance(event: any) {
    this.locationAccepted = event.checked;
  }

}
