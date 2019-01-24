import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FingerprintComponent } from './fingerprint.component';
import { Observable, Subscription, of } from 'rxjs';
import { AgencyProfile, SiteLocation } from '../../models';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, agency, state, siteLocations } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Router } from '@angular/router';
import { WindowService } from '../../services/window.service';

/* Test Dialog */
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { timer } from 'rxjs';

describe('FingerprintComponent', () => {
  let component: FingerprintComponent;
  let fixture: ComponentFixture<FingerprintComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let enrollmentService: EnrollmentService;
  let windowService: WindowService;
  let router: Router;

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
    fixture = TestBed.createComponent(FingerprintComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    windowService = fixture.debugElement.injector.get(WindowService);
    router = TestBed.get(Router);
    localStorage.removeItem('locationAccepted');
    spyOn(dataService, 'getStateSiteLocations').and.returnValue( of({ result: siteLocations }));
    spyOn(enrollmentService, 'getApplicant').and.returnValue(applicant);
    spyOn(enrollmentService, 'getAgency').and.returnValue(agency);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get agency profile', () => {
    spyOn(dataService, 'setRouteData').and.callThrough();
    fixture.detectChanges();
    expect(component.agency).not.toBeNull();
  });

  it('should populate site acceptance if completed', () => {
    localStorage.setItem('locationAccepted', JSON.stringify(true));
    fixture.detectChanges();
    expect(component.locationAccepted).not.toBeNull();
    expect(component.locationAccepted).toEqual(true);
  });

  it('should not populate site acceptance if not completed', () => {
    fixture.detectChanges();
    expect(component.locationAccepted).not.toBeNull();
  });

  it('should set route data', () => {
    spyOn(dataService, 'setRouteData').and.callThrough();
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should go to next step', () => {
    fixture.detectChanges();
    spyOn(stepperService, 'completeStep').and.callThrough();
    component.submitEnrollmentForm();
    fixture.detectChanges();
    expect(stepperService.completeStep).toHaveBeenCalled();
  });

  it('should got to previous step ', () => {
    spyOn(stepperService, 'goToPreviousStep').and.callThrough();
    component.goToPreviousStep();
    fixture.detectChanges();
    expect(stepperService.goToPreviousStep).toHaveBeenCalled();
  });

  it('should toggle location acceptance ', () => {
    fixture.detectChanges();
    let fpUser = component.fingerPrintForm.get('fingerPrintCardUser');
    spyOn(component, 'openDialog').and.returnValue(true);
    fpUser.patchValue(true);
    fixture.detectChanges();

    let event: any = { checked: true };
    component.toggleLocationAcceptance(event);
    fixture.detectChanges();
    expect(component.locationAccepted).not.toBeNull();
    expect(component.locationAccepted).toEqual(true);
    event.checked = false;
    component.toggleLocationAcceptance(event);
    fixture.detectChanges();
    expect(component.locationAccepted).toEqual(false);
  });

});
