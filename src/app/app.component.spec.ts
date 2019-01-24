import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogueComponent } from './components/dialogue/dialogue.component';


import { TestImports } from './core/testing/imports';
import { TestDeclarations } from './core/testing/declarations';
import { TestProviders } from './core/testing/providers';
import { applicant, applicants, agency, states, faq, agencyServiceLevels, privacy, mailingAddress, paymentTypes, siteLocations } from './core/testing/variables';

/* Services */
import { DataService } from './services/data.service';
import { StepperService } from './components/stepper/stepper.service';
import { WindowService } from './services/window.service';
import { EnrollmentService } from './services/enrollment.service';



describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dataService: DataService;
  let stepperService: StepperService;
  let windowService: WindowService;
  let enrollmentService: EnrollmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    stepperService = fixture.debugElement.injector.get(StepperService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    windowService = fixture.debugElement.injector.get(WindowService);
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should set stepper active', async(() => {
    component.setStepper(false);
    fixture.detectChanges();
    expect(component.stepper).toBeTruthy();

    component.setStepper(true);
    fixture.detectChanges();
    expect(component.stepper).toBeFalsy();
  }));

  it('should toggle menu', async(() => {
    component.toggleMenu();
    fixture.detectChanges();
    let menuDe = fixture.debugElement.query( By.css('.naps-menu-wrapper'));
    expect(menuDe).not.toBeNull();
  }));
});
