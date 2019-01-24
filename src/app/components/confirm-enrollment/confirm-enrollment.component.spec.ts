import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEnrollmentComponent } from './confirm-enrollment.component';
import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, applicants, agency, state, searchResult } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { StaticDataService } from '../../services/static-data.service';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/of';
import { AgencyProfile, Agency, Applicant } from '../../models';
import { WindowService } from '../../services/window.service';

describe('ConfirmEnrollmentComponent', () => {
  let component: ConfirmEnrollmentComponent;
  let fixture: ComponentFixture<ConfirmEnrollmentComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let enrollmentService: EnrollmentService;
  let staticDataService: StaticDataService;
  let windowService: WindowService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(ConfirmEnrollmentComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    staticDataService = fixture.debugElement.injector.get(StaticDataService);
    windowService = fixture.debugElement.injector.get(WindowService);

    localStorage.setItem('applicantState', 'GA');
    spyOn(enrollmentService, 'submitEnrollment').and.callThrough();
    spyOn(enrollmentService, 'updateEnrollment').and.callThrough();
    spyOn(enrollmentService, 'getApplicant').and.returnValue(applicant);
    spyOn(enrollmentService, 'getAgency').and.returnValue(agency);
    spyOn(enrollmentService, 'applicantChanged').and.returnValue(false);
    spyOn(dataService, 'getAgency').and.returnValue( Observable.of({ result: agency}));
    spyOn(dataService, 'setRouteData').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get applicant', () => {
    fixture.detectChanges();
    expect(component.applicant).not.toBeNull();
  });

  it('should set route data', () => {
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should format credit card number', () => {
    fixture.detectChanges();
    let cn ='5148875063870734';
    let fNumber = '*' + cn.substring(cn.length - 4, cn.length);
    component.formatCreditCardNumber(cn);
    fixture.detectChanges();
    expect(component.formattedNumber).toEqual(fNumber);
  });

  it('should set brand', () => {
    fixture.detectChanges();
    let cardType = 'visa';
    component.setBrand(cardType);
    fixture.detectChanges();
    expect(component.brand).toEqual(cardType);
  });

  it('should go to next step', () => {
    fixture.detectChanges();
    spyOn(stepperService, 'goToPreviousStep').and.callThrough();
    component.goToPreviousStep();
    fixture.detectChanges();
    expect(stepperService.goToPreviousStep).toHaveBeenCalled();
  });

  it('should toggle captcha', () => {
    fixture.detectChanges();
    component.toggleCaptcha(false);
    expect(component.captchaConfirmed).toBeFalsy();
    component.toggleCaptcha(true);
    expect(component.captchaConfirmed).toBeTruthy();
  });

  it('should confirm enrollment', () => {
    fixture.detectChanges();
    expect(component.enrollmentConfirmed).toBeFalsy();
    component.confirmEnrollment();
    fixture.detectChanges();
    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(enrollmentService.submitEnrollment).toHaveBeenCalled();
      expect(component.enrollmentConfirmed).toBeTruthy();
    });
  });

  it('should update enrollment', () => {
    component.enrollmentComplete = true;
    fixture.detectChanges();
    expect(component.enrollmentConfirmed).toBeFalsy();
    component.updateEnrollment();
    fixture.detectChanges();
    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(enrollmentService.updateEnrollment).toHaveBeenCalled();
      expect(component.enrollmentConfirmed).toBeTruthy();
    });
  });

});
