import { Component, OnInit, OnDestroy, ElementRef, QueryList, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AddressInfo,
  Agency,
  AgencyProfile,
  AgencyServiceLevel,
  Applicant,
  PersonInfo,
  RefData,
  State,
  ValidationError
} from '../../models';
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { StaticDataService } from '../../services/static-data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogueComponent } from '../dialogue/dialogue.component';
import * as moment from 'moment';

@Component({
  selector: 'applicant-information',
  templateUrl: './applicant-information.component.html',
  styleUrls: ['./applicant-information.component.css']
})
export class ApplicantInformationComponent implements OnInit, OnDestroy {

  @ViewChild('ssn') social: ElementRef;
  @ViewChild('vssn') vsocial: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('vemail') vemail: ElementRef;

  applicant: Applicant;
  agency: Agency;
  serviceLevel: AgencyServiceLevel;
  serviceLevels: AgencyServiceLevel[];
  enrollmentForm: FormGroup;
  enrollmentFormOptionDefault: RefData = { value: null, name: 'SELECT' };

  socialSecurityNumberMatch: boolean;
  emailAddressesMatch: boolean = false;
  validEnrollmentForm: boolean;
  applicantLoaded: boolean;
  enrollmentComplete: boolean;

  states: State[] = [];
  paymentTypes: any[] = [];
  requiredFields: string[] = [];
  invalidFields: ValidationError[] = [];
  subs: Subscription[] = [];

  constructor(public dataService: DataService,
    private enrollmentService: EnrollmentService,
    private stepperService: StepperService,
    private staticDataService: StaticDataService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public windowService: WindowService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getAgency();
    this.setupForm();
    this.getStates();
    this.getApplicant();
    this.dataService.setRouteData(this.route.snapshot.data);
    this.enrollmentComplete = this.enrollmentService.applicantEnrollmentComplete;
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  /* For Demo Only populates user from assets/files/applicant.json file*/
  demoApplicantData() {
    this.populateApplicantData(this.staticDataService.applicant);
  }

  getApplicant() {
    let applicant = this.enrollmentService.getApplicant();
    if(applicant) {
      this.applicant = applicant;
      this.populateApplicantData(this.applicant);
      this.applicantLoaded = true;
      this.enrollmentForm.controls['stateCode'].patchValue(this.applicant.stateCode);
    } else {
      this.enrollmentForm.controls['stateCode'].patchValue(this.agency.stateCode);
    }
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


  populateApplicantData(applicant: Applicant) {
    this.applicant = applicant;
    if(this.vemail && this.applicant) {
      if(applicant.person && applicant.person.email) {
        this.vemail.nativeElement.value = applicant.person.email;
      }
      if(applicant.person) this.enrollmentForm.patchValue(applicant);
    }
    this.enrollmentForm.controls['stateCode'].patchValue(this.agency.stateCode)
  }

  /* Get selected agency from privacy form in localstorage */
  getAgency() {
    let agency = this.enrollmentService.getAgency();
    if(agency) {
      this.agency = agency;
      this.getAgencyServiceLevels(this.agency.stateCode);
    }
  }

  /* Get Abstract Control from Form Group */
  getControl(control: string, parent?: string): any {
    if(parent) {
      return this.enrollmentForm.get(parent).get(control);
    } else {
      return this.enrollmentForm.get(control);
    }
  }

  /* Check if form control/field failed vailidation */
  getError(control: string): boolean {
    return this.invalidFields.findIndex(f=> f.field === control) > -1;
  }

  /* Return error message for date field with failed validation */
  getDateErrorMessage(input: string): string {
    let control = this.enrollmentForm.get(input);
    return control && control.errors && control.errors.date ? control.errors.date.message : null;
  }

  /* Return error message for field with failed validation */
  getMatchErrorMessage(input: string): string {
    let control = this.enrollmentForm.get(input);
    return control && control.errors && control.errors.match ? control.errors.match.message : null;
  }

  /* Return the associated label text for form field */
  getLabelText(control: string): string {
    return this.staticDataService.formMap.find(m=> m.field === control);
  }

  getReason(name: string) {
    let reason = this.agency.reasons.find(r=> r.name === name);
    const transactionReason = this.getControl('reason', 'transaction');
    transactionReason.patchValue(reason);
    this.getAgencyServiceLevel(reason.agencyServiceLevelId);
  }

  getAgencyServiceLevel(id: string) {
    this.subs.push(this.dataService.getAgencyServiceLevel(this.agency.stateCode, id).
    subscribe(response=> {
      this.serviceLevel = response.result;
      const transactionAgencyServiceLevel = this.getControl('reviewingAgencyServiceLevel', 'transaction');
      transactionAgencyServiceLevel.patchValue(this.serviceLevel);
    }, err=> {
      console.log(err)
    }));
  }

  getAgencyServiceLevels(stateCode: string) {
    if(stateCode) {
      this.subs.push(this.dataService.getAgencyServiceLevels(this.agency.stateCode).
      subscribe(response=> {
        this.serviceLevels = response.result;
      }, err=> {
        console.log(err)
      }));
    }
  }

  getStates() {
    return this.dataService.getStates().
    subscribe(response=> {
      this.states = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
    });
  }

  /* Call stepper service to go back a step */
  goToPreviousStep() {
    this.stepperService.goToPreviousStep();
  }

  /* Create Enrollment Form Group */
  setupForm() {
    this.enrollmentForm = new FormGroup({
      id: new FormControl(),
      stateCode: new FormControl(),
      confirmation: new FormControl(),
      status: new FormControl(),
      qrCode: new FormControl(),
      transaction: new FormGroup({
        reviewingAgencyId: new FormControl(null, Validators.required),
      	reason: new FormGroup({
          agencyServiceLevelId: new FormControl(null, Validators.required),
          agencyServiceLevelName: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required),
          name: new FormControl(null, Validators.required)
        }),
      	requestingAgencyId: new FormControl(),
      	appliedPosition: new FormControl(),
        reviewingAgency: new FormControl(null, Validators.required),
        reviewingAgencyServiceLevel: new FormGroup({
          id: new FormControl(null, Validators.required),
          name: new FormControl(null, Validators.required),
          electronicFee: new FormControl(null, Validators.required),
          paperFee: new FormControl(null, Validators.required),
          stateCode: new FormControl(null, Validators.required),
          serviceLevel: new FormControl(),
          agencyElectronicFeePercent: new FormControl(),
          agencyPaperFeePercent: new FormControl()
        })
      }),
      person: new FormGroup({
        lastName: new FormControl(null, Validators.required),
      	firstName: new FormControl(null, Validators.required),
      	middleName: new FormControl(),
      	suffix: new FormControl(),
      	ssn: new FormControl(null, [Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$'), this.validateSocialSocialSecurityNumber]),
      	dateOfBirth: new FormControl(null, [Validators.minLength(8), Validators.maxLength(8), Validators.required, Validators.pattern('^[0-9]*$'), this.validateDateOfBirth]),
      	weight: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      	gender: new FormControl(null, Validators.required),
      	race: new FormControl(null, Validators.required),
      	eyeColor: new FormControl(null, Validators.required),
      	hairColor: new FormControl(null, Validators.required),
      	height: new FormControl(null, Validators.required),
      	placeOfBirth: new FormControl(null, Validators.required),
      	countryOfCitizenship: new FormControl(),
      	stateDriversLicense: new FormControl(),
      	driversLicenseNumber: new FormControl(),
        phone: new FormControl(null, [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
        email: new FormControl(null, [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z0-9]{2,4}$'), Validators.required, this.validateEmailAddress]),
      }),
      address: new FormGroup({
        address1:	new FormControl(null, Validators.required),
        address2:	new FormControl(),
        city:	new FormControl(null, Validators.required),
        suite: new FormControl(),
        state: new FormControl(null, Validators.required),
        zip: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')])
      })
    });

    this.requiredFields = [
      'reviewingAgencyId',
      'reason',
      'lastName',
      'firstName',
      'dateOfBirth',
      'weight',
      'gender',
      'race',
      'eyeColor',
      'hairColor',
      'height',
      'placeOfBirth',
      'phone',
      'email',
      'address1',
      'city',
      'state',
      'zip'
    ];

    const reviewingAgencyId = this.getControl('reviewingAgencyId', 'transaction');
    const reviewingAgency = this.getControl('reviewingAgency', 'transaction');
    reviewingAgencyId.patchValue(this.agency.id);
    reviewingAgency.patchValue(this.agency.name);
    this.subs.push(this.enrollmentForm.valueChanges.subscribe(value=> this.validateForm()));
  }

  /* Submit form */
  submitEnrollmentForm() {
    /* Form Validated */
    this.enrollmentService.saveApplicant(this.enrollmentForm.value);
    this.stepperService.completeStep();
  }

  updateValidation(input: string, parent?: string) {
    if(parent) {
      const control = this.getControl(input, parent);
      control.updateValueAndValidity();
    } else {
      const control = this.getControl(input);
      control.updateValueAndValidity();
    }
  }

  /* Test form validation and set button toggle variable */
  validateForm() {
    console.log(this.enrollmentForm)
    if(this.enrollmentForm.valid) {
      this.validEnrollmentForm = true;
    } else {
      this.validEnrollmentForm = false;
    }
  }

  /* Check if required fields have values */
  validateRequiredFields(value: any) {
    if(value) {
      Object.keys(value).forEach(k=> {
        if(value[k] instanceof Object) {
          this.validateRequiredFields(value[k]);
        } else {
          if(this.requiredFields.indexOf(k) > -1 && !value[k]) this.invalidFields.push({ field: k, required: true});
        }
      });
    }
  }

  /* Custom validation for dob control */
  validateDateOfBirth(control: FormControl): any {
    if(control.value && control.value.length === 8) {
      let today = moment();
      let eighteenYearsAgo = moment([today.year() - 18, today.month(), today.date()]);
      let momentFormat = control.value.substr(4,4)+'-'+control.value.substr(0,2)+'-'+control.value.substr(2,2);
      let isEighteen = moment(momentFormat).isBefore(eighteenYearsAgo);
      let isFutureDate = moment(momentFormat).isSameOrAfter(today);
      let d = moment(momentFormat);
      if(!d.isValid()) {
        return { date: { message: 'Invalid Date'} };
      } else if(isFutureDate) {
        return { date: { message: 'Date cannot be a future date'} };
      } else if(!isEighteen) {
        return { date: { message: 'Applicant does not meet age requirement'} };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /* Custom validation for email control */
  validateEmailAddress(control: FormControl): any {
    let vemail = <HTMLInputElement>document.querySelector('#vemail');
    if(control.value && vemail.value) {
      if(control.value != vemail.value) {
        return { match: { message: 'Email addresses do not match' }};
      } else {
        return null;
      }
    } else if((control.value && !vemail.value) || (!control.value && vemail.value)) {
      return { match: { message: 'Please confirm email' }};
    } else {
      return null;
    }
  }

  /* Custom validation for ssn control */
  validateSocialSocialSecurityNumber(control: FormControl): any {
    let vssn = <HTMLInputElement>document.querySelector('#vssn');
    if(control.value && vssn.value) {
      if(control.value != vssn.value) {
        return { match: { message: 'Social security numbers does not match' }};
      } else {
        return null;
      }
    } else if((control.value && !vssn.value) || (!control.value && vssn.value)) {
      return { match: { message: 'Please confirm ssn' }};
    } else {
      return null;
    }
  }

}
