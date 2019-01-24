import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrivacyComponent } from './privacy.component';
import { Observable, Subscription, of } from 'rxjs';
import { AgencyProfile, Agency } from '../../models';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, agency, state } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';


describe('PrivacyComponent', () => {
  let component: PrivacyComponent;
  let fixture: ComponentFixture<PrivacyComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let enrollmentService: EnrollmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);

    spyOn(dataService, 'setRouteData').and.callThrough();
    spyOn(dataService, 'getStates').and.callThrough();
    spyOn(enrollmentService, 'getApplicant').and.returnValue( applicant );
    spyOn(enrollmentService, 'getAgency').and.returnValue( agency );
    spyOn(stepperService, 'completeStep').and.callThrough();
    spyOn(stepperService, 'goToPreviousStep').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup form', () => {
    fixture.detectChanges();
    expect(component.privacyForm).not.toBeNull();
  });

  it('should get states', () => {
    component.getStates();
    fixture.detectChanges();
    expect(dataService.getStates).toHaveBeenCalled();
    expect(component.states).not.toBeNull();
  });

  it('should set route data', () => {
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should get state agencies', () => {
    fixture.detectChanges();
    component.getAgenciesByState(state.stateCode);
    fixture.detectChanges();
    expect(component.stateAgencies).not.toBeNull();
  });

  it('should get agency agency', () => {
    fixture.detectChanges();
    component.populateForm();
    component.getAgency();
    fixture.detectChanges();
    expect(component.selectedAgencyProfile).not.toBeNull();
  });

  it('should go to next step', () => {
    fixture.detectChanges();
    component.next();
    fixture.detectChanges();
    expect(stepperService.completeStep).toHaveBeenCalled();
  });

  it('should got to previous step ', () => {
    component.goToPreviousStep();
    fixture.detectChanges();
    expect(stepperService.goToPreviousStep).toHaveBeenCalled();
  });

});
