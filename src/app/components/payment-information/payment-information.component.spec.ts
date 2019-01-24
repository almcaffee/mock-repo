import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { PaymentInformationComponent } from './payment-information.component';
import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, applicants, states, faq, agencies, agencyServiceLevels, paymentTypes } from '../../core/testing/mock-data';
import { WindowService } from '../../services/window.service';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { StaticDataService } from '../../services/static-data.service';
import { Observable, of } from 'rxjs';
import { AgencyProfile, Agency, Applicant } from '../../models';
import { Router, ActivatedRoute } from '@angular/router';

/* Test Dialog */
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { Subscription, timer } from 'rxjs';

describe('PaymentInformationComponent', () => {
  let component: PaymentInformationComponent;
  let fixture: ComponentFixture<PaymentInformationComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let enrollmentService: EnrollmentService;
  let staticDataService: StaticDataService;
  let windowService: WindowService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ DialogueComponent ]
      }
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(PaymentInformationComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    staticDataService = fixture.debugElement.injector.get(StaticDataService);
    windowService = fixture.debugElement.injector.get(WindowService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    spyOn(enrollmentService, 'getApplicant').and.returnValue(applicant);
    spyOn(enrollmentService, 'getAgency').and.returnValue(agencies[0]);
    spyOn(enrollmentService, 'applicantChanged').and.returnValue(false);
    spyOn(enrollmentService, 'resetApplicant').and.returnValue(true);
    spyOn(dataService,'setRouteData').and.callThrough();
    spyOn(dataService,'getStates').and.returnValue( of({ result: states }));
    spyOn(dataService,'getPaymentMethods').and.returnValue( of({ result: paymentTypes }));
    spyOn(stepperService, 'goToPreviousStep').and.callThrough();
    spyOn(stepperService, 'completeStep').and.callThrough();
    spyOn(enrollmentService, 'setPaymentInfo').and.callThrough();
    spyOn(component, 'populatePaymentInfo').and.callThrough();
    spyOn(router, 'navigate').and.returnValue(true);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set route data', () => {
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should get states', () => {
    fixture.detectChanges();
    expect(dataService.getStates).toHaveBeenCalled();
    component.states = [];
    fixture.detectChanges();
    expect(component.states.length).toBe(0);
    component.getStates();
    fixture.detectChanges();
    expect(component.states.length).toBe(2);
    expect(component.states).toBe(states);
  });

  it('should get agency', () => {
    fixture.detectChanges();
    expect(component.agency).not.toBeNull();
    expect(component.agency).toEqual(agencies[0]);
  });

  it('should set applicant', () => {
    fixture.detectChanges();
    component.getApplicant();
    fixture.detectChanges();
    expect(component.applicant).not.toBeNull();
    expect(component.applicant).toEqual(applicant);
  });

  it('should go to previous step', () => {
    fixture.detectChanges();
    component.goToPreviousStep();
    fixture.detectChanges();
    expect(stepperService.goToPreviousStep).toHaveBeenCalled();
  });

  it('should reset enrollment form', () => {
    fixture.detectChanges();
    component.resetEnrollmentForm();
    fixture.detectChanges();
    let address = component.enrollmentForm.get('billingAddress.address1');
    let cardHolder = component.enrollmentForm.get('creditCard.cardHolder');
    expect(address.value).toBeNull();
    expect(cardHolder.value).toBeNull();
  });

  it('should validate form', () => {
    fixture.detectChanges();
    component.populatePaymentInfo(applicants[1].payment);
    fixture.detectChanges();
    expect(component.enrollmentForm.valid).toBeFalsy();
    component.populatePaymentInfo(applicants[0].payment);
    fixture.detectChanges();
    expect(component.enrollmentForm.valid).toBeTruthy();
  });

  it('should set payment info', () => {
    fixture.detectChanges();
    component.submitEnrollmentForm();
    fixture.detectChanges();
    expect(stepperService.completeStep).toHaveBeenCalled();
  });

  it('should set payment accepted', () => {
    fixture.detectChanges();
    component.togglePaymentAcceptance({ checked: false });
    fixture.detectChanges();
    expect(component.paymentAccepted).toBeFalsy();
    component.togglePaymentAcceptance({ checked: true });
    fixture.detectChanges();
    expect(component.paymentAccepted).toBeTruthy();
  });

  it('should set payment accepted', () => {
    fixture.detectChanges();
    component.editPaymentInfo();
    fixture.detectChanges();
    expect(component.editPayment).toBeTruthy();
    expect(component.paymentAccepted).toBeFalsy();
    component.editPaymentInfo();
    fixture.detectChanges();
    expect(component.editPayment).toBeFalsy();
    expect(component.paymentAccepted).toBeTruthy();
  });

  it('should populate data for demo', () => {
    fixture.detectChanges();
    staticDataService.generateApplicant();
    component.demoApplicantData();
    fixture.detectChanges();
    expect(component.populatePaymentInfo).toHaveBeenCalled();
  });

  it('should remove keys with no electronic payment', () => {
    fixture.detectChanges();
    staticDataService.generateApplicant();
    component.demoApplicantData();
    let pm = component.enrollmentForm.get('paymentMethod');
    pm.patchValue('MAIL_IN');
    fixture.detectChanges();
    let value = component.enrollmentForm.value;
    delete value['paymentType'];
    delete value['creditCard'];
    delete value['billingAddress'];
    component.submitEnrollmentForm();
    fixture.detectChanges();
    expect(enrollmentService.setPaymentInfo).toHaveBeenCalledWith(value, true);
  });

  it('should set discount', () => {
    fixture.detectChanges();
    staticDataService.generateApplicant();
    component.demoApplicantData();
    fixture.detectChanges();
    component.checkCode({ target: { value: 'ABCD'}});
    fixture.detectChanges();
    expect(component.discountApplied).toBeTruthy();
    expect(component.price).toEqual(0.00);
    component.checkCode({ target: { value: 'XXXX'}});
    fixture.detectChanges();
    expect(component.discountApplied).toBeFalsy();
  });

  it('should save previous payment info if confirmed and payment no edited', () => {
    fixture.detectChanges();
    component.applicant = applicants[0];
    component.submitEnrollmentForm();
    fixture.detectChanges();
    expect(enrollmentService.setPaymentInfo).toHaveBeenCalledWith(component.applicant.payment);
  });

  // fit('should handle cancel dialogue options', fakeAsync(() => {
  //   fixture.detectChanges();
  //   component.openDialog('cancel');
  //   fixture.detectChanges();
  //
  //   timer(2500).subscribe(()=> {
  //     let diaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
  //     let cancelDe = fixture.debugElement.query(By.css('button:first-of-type'));
  //     expect(diaDe).not.toBeNull();
  //     expect(cancelDe).not.toBeNull();
  //     cancelDe.triggerEventHandler('click', null);
  //     fixture.detectChanges();
  //   });
  //
  //   tick(2501);
  //
  // }));

});
