import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotConfirmationComponent } from './forgot-confirmation.component';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, applicants, agency, states, searchResult, faq, agencyServiceLevels, applicantNoPayment } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { Observable, Subscription, timer } from 'rxjs';
import 'rxjs/add/observable/of';
import { AgencyProfile, Agency, Applicant } from '../../models';

describe('ForgotConfirmationComponent', () => {
  let component: ForgotConfirmationComponent;
  let fixture: ComponentFixture<ForgotConfirmationComponent>;
  let dataService: DataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotConfirmationComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    spyOn(dataService, 'resendConfirmation').and.callThrough();
    spyOn(dataService, 'getStates').and.callThrough();
    spyOn(dataService, 'setRouteData').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
