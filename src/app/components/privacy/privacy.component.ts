import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { Agency, AgencyProfile, Privacy, NapsApiResponse, State } from '../../models';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogueComponent } from '../dialogue/dialogue.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit, OnDestroy {

  privacy: Privacy;
  privacyAccepted: boolean;
  privacyLoaded: boolean;
  privacyForm: FormGroup;
  privacyMarkdown: string;
  selectedAgency: Agency;
  selectedAgencyProfile: AgencyProfile;
  loadedState: string;
  loadedAgency: string;
  states: State[] = [];
  stateAgencies: Agency[] = [];
  subscriptions: Subscription[] = [];
  enrollmentComplete: boolean;

  constructor(public dataService: DataService,
    private enrollmentService: EnrollmentService,
    private stepperService: StepperService,
    private route: ActivatedRoute,
    private router: Router,
    public windowService: WindowService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.setupForm();
    this.dataService.setRouteData(this.route.snapshot.data);
    this.populateForm();
  }

  /* Remove subscriptions to clear memory */
  ngOnDestroy() {
    this.subscriptions.forEach(s=> s.unsubscribe());
  }

  getAgenciesByState(stateCode: string, agencyId?: string) {
    if(stateCode) {
      localStorage.setItem('applicantState', stateCode);
      this.enrollmentService.setStateCode(stateCode);
      this.subscriptions.push(this.dataService.getAgenciesByState(stateCode)
      .subscribe(response=> {
        this.stateAgencies = response.result;
        if(agencyId) {
          this.selectedAgency =  this.stateAgencies.find(sa=> sa.id === agencyId);
          if(this.selectedAgency) this.loadedAgency =  this.selectedAgency.name;
          if(this.selectedAgency) this.privacyForm.controls['agency'].patchValue(this.selectedAgency);
        }
      }, err=> {
        console.log(err)
      }));
    }
  }

  /* Profile json return bad form error */
  getAgency() {
    this.selectedAgency = this.privacyForm.controls['agency'].value;
    this.enrollmentService.setAgency(this.selectedAgency);
    this.subscriptions.push(this.dataService.getAgencyPrivacy(this.selectedAgency.stateCode, this.selectedAgency.privacyId).
    subscribe(response=> {
      this.privacy = response.result;
    }, err=> {
      console.log(err)
    }));
  }

  getStates(applicantStateCode?: string) {
    if(applicantStateCode) this.enrollmentService.setStateCode(applicantStateCode);
    this.subscriptions.push(this.dataService.getStates().
    subscribe(response=> {
      this.states = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
      if(applicantStateCode) {
        let loadedState = this.states.find(s=> s.stateCode === applicantStateCode);
        if(loadedState) {
          this.loadedState = loadedState.name;
          this.privacyForm.controls['state'].patchValue(this.loadedState);
        }
      }
    }, err=> {
      console.log(err)
    }));
  }

  goToPreviousStep() {
    this.stepperService.goToPreviousStep();
  }

  next() {
    this.stepperService.completeStep();
  }

  openDialog() {

    if(this.privacyForm.touched) {
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
              this.router.navigate(['/applicant-review']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      );
    } else {
      if(this.enrollmentService.applicantEnrollmentComplete) {
        this.router.navigate(['/applicant-review']);
      } else {
        this.router.navigate(['/']);
      }
    }

  }

  populateForm() {
    /* Check for existing applicant/agency */
    let agency = this.enrollmentService.getAgency();
    let applicant = this.enrollmentService.getApplicant();
    if(agency) {
      this.privacyForm.controls['agency'].patchValue(agency);
      this.getStates(agency.stateCode);
    } else {
      this.getStates();
    }
    if(applicant) {
      if(applicant.stateCode) this.enrollmentService.setStateCode(applicant.stateCode);
      if(applicant.stateCode) this.getStates(applicant.stateCode);
      if(applicant.stateCode && applicant.transaction) {
        this.getAgenciesByState(applicant.stateCode, applicant.transaction.reviewingAgencyId);
      } else if(agency) {
        this.getAgenciesByState(agency.stateCode, agency.id);
      } else if(applicant.stateCode) {
        this.getAgenciesByState(applicant.stateCode);
      }
      if(this.enrollmentService.enrollmentComplete) {
        this.enrollmentComplete = true;
        this.privacyAccepted = true;
        this.privacyLoaded = true;
      }
    }
  }

  setupForm() {
    this.privacyForm = new FormGroup({
      state: new FormControl(null, Validators.required),
      agency: new FormControl(null, Validators.required)
    });
    this.subscriptions.push(this.privacyForm.controls['state'].valueChanges.subscribe((state)=> this.getAgenciesByState(state.stateCode)));
    this.subscriptions.push(this.privacyForm.controls['agency'].valueChanges.subscribe(()=> this.getAgency()));
  }

  setSelectedAgency(agency: Agency) {
    this.selectedAgency = agency;
  }

  togglePrivacyAcceptance(event: any) {
    this.privacyAccepted = event.checked;
  }

}
