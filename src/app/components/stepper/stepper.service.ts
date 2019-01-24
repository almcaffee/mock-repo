import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

export interface Step {
  label?: string;
  completed?: boolean;
  route?: string;
  active?: boolean;
  next?: number;
  previous?: number;
  canAutoComplete?: boolean;
  editable?: boolean;
  interacted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  steps: Step[] = [
    { active: false, editable: false, interacted: false, label: 'Privacy', completed: false, route: '/privacy', canAutoComplete: true },
    { active: false, editable: false, interacted: false, label: 'Applicant Information', completed: false, route: '/applicant-information', canAutoComplete: true },
    { active: false, editable: false, interacted: false, label: 'Fingerprinting Options', completed: false, route: '/fingerprinting', canAutoComplete: true },
    { active: false, editable: false, interacted: false, label: 'Payment Information', completed: false, route: '/payment-information', canAutoComplete: true },
    { active: false, editable: false, interacted: false, label: 'Confirm Enrollment', completed: false, route: '/confirm-enrollment', canAutoComplete: true }
  ];

  stepsCompleted: boolean;
  currentStep: Step;
  currentStepIndex: number;
  completedStepSource = new Subject<number>();
  incompleteStepSource = new Subject<number>();
  currentStepSource = new Subject<number>();
  completedStepSubscription$ = this.completedStepSource.asObservable();
  incompleteStepSubscription$ = this.incompleteStepSource.asObservable();
  currentStepSubscription$ = this.currentStepSource.asObservable();

  constructor(private router: Router) {
    this.currentStepIndex = 0;
    this.currentStep = this.steps[this.currentStepIndex];
  }

  canActivateStep(route: string): boolean {
    let routeStepIndex = this.steps.findIndex(s=> s.route === route);
    if(routeStepIndex === 0) {
      return true;
    } else if(routeStepIndex > 0) {
      return this.steps[routeStepIndex - 1].completed;
    } else {
      return false;
    }
  }

  /* Check if previous step was complete */
  canCompleteStep(clickedStepIndex: number): boolean {
    if(clickedStepIndex === 0 || (this.steps[clickedStepIndex - 1] && this.steps[clickedStepIndex - 1].completed && clickedStepIndex != this.currentStepIndex)) {
      return true;
    } else {
      return false;
    }
  }

  clearSteps() {
    this.steps.forEach((step, index)=> {
      step.active = false;
      step.editable = false;
      step.interacted = false;
      step.completed = false;
    });
    this.stepsCompleted = false;
    this.currentStepIndex = 0;
    this.currentStep = this.steps[this.currentStepIndex];
  }

  /* Completes step of passed in index and sends the next step index to be set as active */
  completeStep(stepIndex?: number) {
    if(stepIndex) {
      this.steps[stepIndex].completed = true;
      this.steps[stepIndex].editable = false;
      this.steps[stepIndex].interacted = false;
      this.completedStepSource.next(stepIndex);
    } else {
      this.steps[this.currentStepIndex].completed = true;
      this.completedStepSource.next(this.currentStepIndex);
    }
    this.setActiveStep(this.currentStepIndex + 1);
  }

  completeSteps() {
    this.steps.forEach((step, index)=> {
      if(step.canAutoComplete) {
        step.completed = true;
        step.editable = true;
        step.interacted = true;
        this.completedStepSource.next(index);
      }
    });
    this.stepsCompleted = true;
    this.currentStepIndex = 0;
    this.currentStep = this.steps[this.currentStepIndex];
  }

  completeConfirmation() {
    this.steps[this.steps.length - 1].completed = true;
    this.steps[this.steps.length - 1].editable = true;
    this.completedStepSource.next(this.steps.length - 1);
  }

  removeConfirmation() {
    this.steps[this.steps.length - 1].completed = false;
    this.steps[this.steps.length - 1].editable = false;
    this.incompleteStepSource.next(this.steps.length - 1);
  }

  getCurrentStep(): Step {
    return this.currentStep;
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  /* Sets the current step based on the current route */
  getActiveStepFromRoute(route: string) {
    let routeIndex = this.steps.findIndex(s=> s.route === route);
    if(routeIndex > -1) this.setActiveStep(routeIndex);
  }

  /* Filters completed steps then goes to last in array */
  goToLastCompletedStep() {
    let completedSteps = this.steps.filter(s=> s.completed === true);
    if(completedSteps.length) {
      let lastCompletedStepIndex = this.steps.findIndex(s=> s === completedSteps[completedSteps.length - 1]);
      if(lastCompletedStepIndex > 0) {
        this.setActiveStep(lastCompletedStepIndex);
      } else {
        this.setActiveStep(0);
      }
    } else {
      this.setActiveStep(0);
    }
  }

  /* Go to the next step, if the current step is completed */
  goToNextStep() {
    if(this.currentStep.completed && this.currentStepIndex < this.steps.length - 1)  {
      this.setActiveStep(this.currentStepIndex + 1);
    }
  }

  /* Go to the previous step, if exists */
  goToPreviousStep() {
    if(this.currentStepIndex > 0) {
      this.setActiveStep(this.currentStepIndex - 1);
    } else {
      this.setActiveStep(0);
    }
  }

  /* Go to the previous step, if exists */
  goToStep(stepRoute: string) {
    let stepIndex = this.steps.findIndex(s=> s.route === stepRoute);
    this.setActiveStep(stepIndex);
  }

  /* Set the active step and update subscription subject */
  setActiveStep(stepIndex: number) {
    if(this.currentStepIndex != stepIndex) {
      this.currentStepIndex = stepIndex;
      this.steps.forEach((step, index)=> {
        if(index < stepIndex && !step.completed) {
          step.completed = true;
          step.active = false;
        } else if(index === stepIndex) {
          step.active = true;
        } else {
          step.active = false;
        }
      });
      this.currentStep = this.steps[this.currentStepIndex];
      this.completedStepSource.next(this.currentStepIndex)
      this.currentStepSource.next(this.currentStepIndex);
      this.setRoute();
    }
  }

  setRoute() {
    this.router.navigate([this.currentStep.route]);
  }

}
