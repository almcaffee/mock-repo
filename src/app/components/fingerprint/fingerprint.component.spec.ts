import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FingerprintComponent } from './fingerprint.component';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/of';
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
    spyOn(dataService, 'getStateSiteLocations').and.returnValue( Observable.of({ result: siteLocations }));
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

    // timer(1000).subscribe(()=> {
    //   let diaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
    //   let cancelDe = fixture.debugElement.query(By.css('button:first-of-type'));
    //   expect(diaDe).not.toBeNull();
    //   expect(cancelDe).not.toBeNull();
    //   cancelDe.triggerEventHandler('click', null);
    //   fixture.detectChanges();
    //
    //   timer(1000).subscribe(()=> {
    //     diaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
    //     cancelDe = fixture.debugElement.query(By.css('button:first-of-type'));
    //     expect(diaDe).toBeNull();
    //     expect(cancelDe).toBeNull();
    //   });
    // });

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

  // it('should handle cancel dialogue options', async(done) => {
  //   fixture.detectChanges();
  //   component.openDialog('cancel');
  //   fixture.detectChanges();
  //   // give modal time to appear
  //   timer(500).subscribe(()=> {
  //     let diaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
  //     expect(diaDe).not.toBeNull();
  //
  //     let cancelDe = fixture.debugElement.query(By.css('mat-dialog-container mat-dialog-actions button:first-of-type'));
  //     expect(cancelDe).not.toBeNull();
  //     cancelDe.triggerEventHandler('click', null);
  //     fixture.detectChanges();
  //     diaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
  //     expect(diaDe).toBeNull();
  //
  //     component.openDialog('cancel');
  //     fixture.detectChanges();
  //     // give modal time to appear
  //     timer(500).subscribe(()=> {
  //       iaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
  //       expect(diaDe).not.toBeNull();
  //
  //       cancelDe = fixture.debugElement.query(By.css('mat-dialog-container mat-dialog-actions button:last-of-type'));
  //       expect(cancelDe).not.toBeNull();
  //       spyOn(enrollmentService, 'resetApplicant').and.callThrough();
  //       spyOn(router, 'navigate').and.returnValue('true');
  //       cancelDe.triggerEventHandler('click', null);
  //       fixture.detectChanges();
  //       diaDe = fixture.debugElement.query(By.css('mat-dialog-container'));
  //       expect(diaDe).toBeNull();
  //       expect(router.navigate).toHaveBeenCalled();
  //       expect(enrollmentService.resetApplicant).toHaveBeenCalled();
  //       done();
  //     });
  //   });
  // });
});
