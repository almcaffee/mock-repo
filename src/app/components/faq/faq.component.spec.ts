import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqComponent } from './faq.component';

import { TestImports } from '../../core/testing/imports';
import { TestDeclarations } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { faq } from '../../core/testing/variables';

/* Imports for this test only */
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { AgencyProfile, Agency, Applicant } from '../../models';
import { Router, ActivatedRoute } from '@angular/router';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;
  let dataService: DataService;
  let enrollmentService: EnrollmentService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    dataService = fixture.debugElement.injector.get(DataService);
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    spyOn(dataService, 'getFaq').and.returnValue( Observable.of(faq));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set route data', () => {
    spyOn(dataService, 'setRouteData').and.callThrough();
    fixture.detectChanges();
    expect(dataService.setRouteData).toHaveBeenCalled();
  });

  it('should get faq', () => {
    fixture.detectChanges();
    component.faqs = [];
    fixture.detectChanges();
    expect(component.faqs.length).toBe(0);
    component.getAllFaq();
    fixture.detectChanges();
    expect(dataService.getFaq).toHaveBeenCalled();
    expect(component.faqs.length).toBe(faq.length);
  });

  it('should change route based on selected faq', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate').and.callThrough();
    component.getFaq('2');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/faq/2']);
  });

  it('should expand panel of selected faq', () => {
    fixture.detectChanges();
    component.viewFaq(2);
    fixture.detectChanges();
    expect(component.panels['_results'][1]['expanded']).toBe(true);
  });

});
