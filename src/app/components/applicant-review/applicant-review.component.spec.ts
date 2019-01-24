import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ApplicantReviewComponent } from './applicant-review.component';
import { DialogueComponent } from '../dialogue/dialogue.component';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations, EntryComponents } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, searchResult, agency, faq } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Observable, of } from 'rxjs';
import { AgencyProfile, Agency, Applicant } from '../../models';
import { Router, ActivatedRoute } from '@angular/router';

describe('ApplicantReviewComponent', () => {
  let component: ApplicantReviewComponent;
  let fixture: ComponentFixture<ApplicantReviewComponent>;
  let dataService: DataService;
  let enrollmentService: EnrollmentService;
  let stepperService: StepperService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ DialogueComponent ]
      }
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(ApplicantReviewComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    spyOn(enrollmentService, 'getApplicant').and.returnValue(applicant);
    spyOn(dataService,'setRouteData').and.callThrough();
    spyOn(dataService, 'getAgency').and.returnValue(agency);
    enrollmentService['agency'] = agency;
    enrollmentService.applicantEnrollmentComplete = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set route data', () => {
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should get agency profile', () => {
    component.setApplicant(applicant);
    fixture.detectChanges();
    expect(component.agency).not.toBeNull();
    expect(component.agency).toEqual(agency);
  });

  it('should set applicant', () => {
    component.setApplicant(applicant);
    component.stateCode = 'GA';
    fixture.detectChanges();
    expect(component.applicant).not.toBeNull();
    expect(component.applicant).toEqual(applicant);
  });

  it('should format credit card number', () => {
    let cn ='5148875063870734';
    let fNumber = '*' + cn.substring(cn.length - 4, cn.length);
    component.formatCreditCardNumber(cn);
    fixture.detectChanges();
    expect(component.formattedNumber).not.toBeNull();
    expect(component.formattedNumber).toEqual(fNumber);
  });

  it('should get faq', () => {
    spyOn(dataService, 'getFaq').and.returnValue( of(faq));
    fixture.detectChanges();
    component.faqs = [];
    fixture.detectChanges();
    expect(component.faqs.length).toBe(0);
    component.getFaqs();
    fixture.detectChanges();
    expect(dataService.getFaq).toHaveBeenCalled();
    expect(component.faqs.length).toBe(faq.length);
  });

  it('should got to step', () => {
    spyOn(stepperService, 'goToStep').and.callThrough();
    component.goToStep('/payment-information');
    fixture.detectChanges();
    expect(stepperService.goToStep).toHaveBeenCalledWith('/payment-information');
  });

});
