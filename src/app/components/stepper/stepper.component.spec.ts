import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StepperComponent } from './stepper.component';
import { AppComponent } from '../../app.component';
import { Observable, Subscription, timer } from 'rxjs';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';

import { StepperService, Step } from './stepper.service';
import { WindowService } from '../../services/window.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Router } from '@angular/router';

describe('StepperComponent', async() => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;
  let stepperService: StepperService;
  let windowService: WindowService;
  let enrollmentService: EnrollmentService;
  let router: Router;

  let steps: Step[] = [
    { active: false, label: 'Privacy', completed: false, route: '/privacy' },
    { active: false, label: 'Applicant Information', completed: false, route: '/applicant-information' },
    { active: false, label: 'Site Location', completed: false, route: '/site-location' },
    { active: false, label: 'Payment Information', completed: false, route: '/payment-information' },
    { active: false, label: 'Confirm Enrollment', completed: false, route: '/confirm-enrollment' }
  ],

  routes: any = [
    { path: '*', component: '' },
    { path: 'applicant-information', component: AppComponent },
    { path: 'confirm-enrollment', component: AppComponent },
    { path: 'payment-information', component: AppComponent },
    { path: 'privacy', component: AppComponent },
    { path: 'site-location', component: AppComponent },
    { path: '**', component: AppComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    stepperService = fixture.debugElement.injector.get(StepperService);
    windowService = fixture.debugElement.injector.get(WindowService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize current step index', () => {
    fixture.detectChanges();
    expect(component.currentStepIndex).not.toBeNull();
    expect(component.currentStepIndex).toEqual(0);
  });

  it('should call stepper service', () => {
    spyOn(stepperService, 'setActiveStep').and.callThrough();
    fixture.detectChanges();
    expect(stepperService.setActiveStep).toHaveBeenCalled();
  });

  it('should change step if last step complete', () => {
    fixture.detectChanges();
    component['stepperService'].completeStep();
    component.changeStep(1);
    fixture.detectChanges();
    expect(component.currentStepIndex).toEqual(1);
  });

});
