import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material';
import { StepperService, Step } from './stepper.service';
import { WindowService } from '../../services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit, OnDestroy {

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  clickedStepIndex: number;
  currentStep: any;
  currentStepIndex: number;
  initializedStepper: boolean = false;
  previousStepIndex: number;
  subs: Subscription[] = [];

  constructor(private router: Router,
    private stepperService: StepperService,
    public windowService: WindowService,
    private enrollmentService: EnrollmentService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.currentStepIndex = 0;
  }

  ngOnDestroy() {
    this.currentStepIndex = null;
    this.stepperService.clearSteps();
    this.subs.forEach(s=> s.unsubscribe());
  }

  ngAfterViewInit() {
    if(!this.stepperService.stepsCompleted) {
      this.stepperService.setActiveStep(0);
      this.stepper.reset();
      if(this.enrollmentService.applicantEnrollmentComplete) {
        this.stepperService.completeSteps();
        this.cdr.detectChanges();
      }
    } else {
      this.stepper.reset();
      this.completeSteps();
      this.currentStepIndex = this.stepperService.currentStepIndex;
      this.currentStep = this.getStep(this.currentStepIndex);
    }
    this.cdr.detectChanges();
    this.subs.push(this.stepperService.incompleteStepSubscription$.subscribe(stepIndex=> this.removeStepCompletion(stepIndex)));
    this.subs.push(this.stepperService.completedStepSubscription$.subscribe(stepIndex=> this.completeStep(stepIndex)));
    this.subs.push(this.stepperService.currentStepSubscription$.subscribe(stepIndex=> this.changeStep(stepIndex)));
  }

  changeStep(stepIndex: number) {
    if(stepIndex >= 0 && stepIndex < this.stepper._steps.length) {
      let previousStep = this.currentStep ? this.currentStep : null;
      this.currentStepIndex = stepIndex;
      this.stepper.selectedIndex = stepIndex;
      this.stepper._steps.forEach((step, index)=> {
        if(index === stepIndex) {
          step['editable'] = true;
          this.cdr.detectChanges();
          step['interacted'] = true;
          this.cdr.detectChanges();
          this.currentStep = step;
        }
      });
      this.stepper['_changeDetectorRef'].detectChanges();
      if(this.currentStep && previousStep != this.currentStep) {
        let step = this.stepperService.getCurrentStep();
        this.router.navigate([step.route]);
      }
    }
  }

  changeSteps() {
    if(this.stepperService.canCompleteStep(this.stepper.selectedIndex)) {
      this.stepperService.setActiveStep(this.stepper.selectedIndex);
      this.previousStepIndex = this.stepper.selectedIndex;
    } else if(this.previousStepIndex != this.stepper.selectedIndex) {
      timer(10).subscribe(()=> this.changeStep(this.currentStepIndex));
    }
  }

  completeStep(stepIndex: number) {
    this.stepper._steps.forEach((step, index)=> {
      if(index === stepIndex) {
        step['completed'] = true;
        this.cdr.detectChanges();
        step['editable'] = true;
        this.cdr.detectChanges();
        step['interacted'] = true;
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
    this.stepper['_changeDetectorRef'].detectChanges();
  }

  completeSteps() {
    this.stepper._steps.forEach((step, index)=> {
        step['completed'] = true;
        this.cdr.detectChanges();
        step['editable'] = true;
        this.cdr.detectChanges();
        step['interacted'] = true;
        this.cdr.detectChanges();
    });
    this.cdr.detectChanges();
    this.stepper['_changeDetectorRef'].detectChanges();
  }

  removeStepCompletion(stepIndex: number) {
    this.stepper._steps.forEach((step, index)=> {
      if(index === stepIndex) {
        step['completed'] = false;
        this.cdr.detectChanges();
        step['editable'] = false;
        this.cdr.detectChanges();
        step['interacted'] = false;
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
    this.stepper['_changeDetectorRef'].detectChanges();
  }

  getStep(stepIndex: number): any {
    return this.stepper._steps['_results'][stepIndex];
  }

}
