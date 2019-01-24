import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantSearchComponent } from './applicant-search.component';
import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { applicant, agency, searchResult, states, testSearch } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

describe('ApplicantSearchComponent', () => {
  let component: ApplicantSearchComponent;
  let fixture: ComponentFixture<ApplicantSearchComponent>;
  let dataService: DataService;
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
    fixture = TestBed.createComponent(ApplicantSearchComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    spyOn(dataService, 'searchApplicant').and.callThrough();
    spyOn(enrollmentService, 'saveApplicant').and.callThrough();
    spyOn(dataService, 'getStates').and.callThrough();
    spyOn(dataService, 'setRouteData').and.callThrough();
    spyOn(dataService, 'searchApplicantByConfirmation').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get states', () => {
    fixture.detectChanges();
    expect(dataService.getStates).toHaveBeenCalled();
  });

  it('should set up enrollment form', () => {
    fixture.detectChanges();
    expect(component.searchForm).not.toBeNull();
  });

  it('should set route data', () => {
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should patch test search data', () => {
    fixture.detectChanges();
    component.loadTestApplicant();
    fixture.detectChanges();
    expect(component.searchForm.value).toEqual(component.testApplicantSearchData);
  });

  it('should search for applicant', () => {
    fixture.detectChanges();
    component.searchForm.patchValue(testSearch);
    component.submitSearchForm();

    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(dataService.searchApplicantByConfirmation).toHaveBeenCalled();
      expect(enrollmentService.saveApplicant).toHaveBeenCalled();
    });
  });




});
