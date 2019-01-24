import { TestBed, inject } from '@angular/core/testing';
import { StepperService } from './stepper.service';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { steps } from '../../core/testing/variables';

describe('StepperService', () => {

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    });
  });

  it('should be created', inject([StepperService], (service: StepperService) => {
    expect(service).toBeTruthy();
  }));

  it('should complete step', inject([StepperService], (service: StepperService) => {
    service.clearSteps();
    spyOn(service, 'setRoute').and.callThrough();
    service.steps = steps;
    service.currentStepIndex = 0;
    service.currentStep = service.steps[service.currentStepIndex];
    service.completeStep();
    expect(service.currentStepIndex).toEqual(1);
  }));

  it('should clear steps', inject([StepperService], (service: StepperService) => {
    spyOn(service, 'setRoute').and.callThrough();
    service.steps = steps;
    service.currentStepIndex = 0;
    service.currentStep = service.steps[service.currentStepIndex];
    service.completeStep();
    service.clearSteps();
    expect(service.currentStepIndex).toEqual(0);
  }));

  it('should go to last step', inject([StepperService], (service: StepperService) => {
    service.clearSteps();
    spyOn(service, 'setRoute').and.callThrough();
    service.steps = steps;
    service.currentStepIndex = 0;
    service.currentStep = service.steps[service.currentStepIndex];
    service.completeStep();
    service.completeStep();
    expect(service.currentStepIndex).toEqual(2);
    service.goToPreviousStep();
    expect(service.currentStepIndex).toEqual(1);
  }));

  it('should go to next step', inject([StepperService], (service: StepperService) => {
    service.clearSteps();
    spyOn(service, 'setRoute').and.callThrough();
    service.steps = steps;
    service.currentStepIndex = 0;
    service.currentStep = service.steps[service.currentStepIndex];
    service.completeStep();
    service.completeStep();
    expect(service.currentStepIndex).toEqual(2);
    service.goToPreviousStep();
    expect(service.currentStepIndex).toEqual(1);
    service.goToNextStep();
    expect(service.currentStepIndex).toEqual(2);
  }));
});
