import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicantInformationComponent } from './applicant-information.component';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, applicants, agency, states, searchResult, faq, agencyServiceLevels, applicantNoPayment } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { StaticDataService } from '../../services/static-data.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { AgencyProfile, Agency, Applicant } from '../../models';
/* Moment.js */
import * as moment from 'moment';

describe('ApplicantInformationComponent', () => {
  let component: ApplicantInformationComponent;
  let fixture: ComponentFixture<ApplicantInformationComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let enrollmentService: EnrollmentService;
  let staticDataService: StaticDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(ApplicantInformationComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    staticDataService = fixture.debugElement.injector.get(StaticDataService);

    spyOn(enrollmentService, 'getApplicant').and.returnValue(applicant);
    spyOn(enrollmentService, 'getAgency').and.returnValue(agency);
    spyOn(dataService, 'getStates').and.returnValue( Observable.of({result: states}));
    spyOn(dataService, 'setRouteData').and.callThrough();
    spyOn(stepperService, 'goToPreviousStep').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get states', () => {
    fixture.detectChanges();
    component.states = [];
    fixture.detectChanges();
    expect(component.states.length).toBe(0);
    component.getStates();
    fixture.detectChanges();
    expect(dataService.getStates).toHaveBeenCalled();
    expect(component.states.length).toBe(2);
    expect(component.states).toBe(states);
  });

  it('should get agency', () => {
    component.getAgency();
    fixture.detectChanges();
    expect(enrollmentService.getAgency).toHaveBeenCalled();
    expect(component.agency).toEqual(agency);
  });

  it('should set up enrollment form', () => {
    fixture.detectChanges();
    expect(component.enrollmentForm).not.toBeNull();
  });

  it('should set route data', () => {
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should get control', () => {
    fixture.detectChanges();
    let controlA = component.enrollmentForm.controls['id'];
    let controlB = component.getControl('id');
    expect(controlA).toBe(controlB);
  });

  it('should go to previous step', () => {
    component.goToPreviousStep();
    fixture.detectChanges();
    expect(stepperService.goToPreviousStep).toHaveBeenCalled();
  });

  it('should populate applicant', () => {
    fixture.detectChanges();
    component.getApplicant();
    fixture.detectChanges();
    expect(enrollmentService.getApplicant).toHaveBeenCalled();
    component.populateApplicantData(component.applicant);
    fixture.detectChanges();
    let appNoPay = applicant;
    delete appNoPay['payment'];
    expect(component.enrollmentForm.value).toEqual(appNoPay);
  });

  it('should validate enrollment form - validate email', () => {
    fixture.detectChanges();
    component.populateApplicantData(applicant);
    component.vemail.nativeElement.value = applicant.person.email;
    fixture.detectChanges();
    let emailControl = component.enrollmentForm.get('person').get('email');
    emailControl.patchValue(applicant.person.email);
    fixture.detectChanges();
    component.updateValidation('person.email');
    fixture.detectChanges();
    emailControl = component.enrollmentForm.get('person').get('email');
    expect(component.enrollmentForm.valid).toBeTruthy();
    component.vemail.nativeElement.value = 'xyz@thm.ftz';
    component.updateValidation('person.email');
    fixture.detectChanges();
    expect(component.enrollmentForm.valid).toBeFalsy();
  });

  it('should validate enrollment form - validate date of birth', () => {
    fixture.detectChanges();
    let formValue = { transaction: applicant.transaction, address: applicant.address, person: applicant.person };
    component.populateApplicantData(formValue);
    component.invalidFields = [];
    fixture.detectChanges();
    let dobControl = component.getControl('person.dateOfBirth');
    component.updateValidation('person.dateOfBirth');
    fixture.detectChanges();
    expect(component.enrollmentForm.valid).toBeTruthy();
  });

  it('should validate enrollment form - validate ssn', () => {
    fixture.detectChanges();
    let formValue = { transaction: applicant.transaction, address: applicant.address, person: applicant.person };
    component.populateApplicantData(formValue);
    component.invalidFields = [];
    fixture.detectChanges();
    let ssnControl = component.getControl('ssn', 'person');
    ssnControl.patchValue('12345678');
    component.updateValidation('ssn', 'person');
    fixture.detectChanges();
    expect(component.enrollmentForm.valid).toBeFalsy();
    component.invalidFields = [];
    component.vsocial.nativeElement.value = '123456789';
    ssnControl = component.getControl('ssn', 'person');
    ssnControl.patchValue('123456789');
    component.updateValidation('ssn', 'person');
    fixture.detectChanges();
    expect(component.enrollmentForm.valid).toBeTruthy();
  });


});
