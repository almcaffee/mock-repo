import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, agency, state, faq } from '../../core/testing/variables';

import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let enrollmentService: EnrollmentService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear localStorage', () => {
    localStorage.setItem('privacy', JSON.stringify({ agency: agency, applicant: applicant }));
    localStorage.setItem('applicantState', 'GA');
    fixture.detectChanges();
    let privacy = localStorage.getItem('privacy'),
    applicantState = localStorage.getItem('applicantState');
    expect(privacy).toBeNull();
    expect(applicantState).toBeNull();
  });

  it('should clear steps', () => {
    spyOn(stepperService, 'clearSteps').and.callThrough();
    fixture.detectChanges();
    expect(stepperService.clearSteps).toHaveBeenCalled();
  });

  it('should clear applicant info', () => {
    spyOn(enrollmentService, 'clearApplicantInfo').and.callThrough();
    fixture.detectChanges();
    expect(enrollmentService.clearApplicantInfo).toHaveBeenCalled();
  });

  it('should set route data', () => {
    spyOn(dataService, 'setRouteData').and.callThrough();
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should start enrollment', () => {
    fixture.detectChanges();
    spyOn(stepperService, 'setRoute').and.callThrough();
    component.startEnrollment();
    fixture.detectChanges();
    expect(stepperService.setRoute).toHaveBeenCalled();
  });

  it('should get faq', () => {
    spyOn(dataService, 'getFaq').and.returnValue( Observable.of(faq));
    fixture.detectChanges();
    component.faqs = [];
    fixture.detectChanges();
    expect(component.faqs.length).toBe(0);
    component.getFaqs();
    fixture.detectChanges();
    expect(dataService.getFaq).toHaveBeenCalled();
    expect(component.faqs.length).toBe(faq.length);
  });

  it('should change route based on selected faq', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate').and.callThrough();
    component.getFaq(2);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalled();
  });

});
