import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { StaticDataService } from '../../services/static-data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { Applicant, State } from '../../models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-applicant-search',
  templateUrl: './applicant-search.component.html',
  styleUrls: ['./applicant-search.component.css']
})
export class ApplicantSearchComponent implements OnInit, OnDestroy {

  @Output() searchResult = new EventEmitter<Applicant>();
  searchForm: FormGroup;
  subs: Subscription[] = [];
  states: State[] = [];
  searchError: string;
  canSearch: boolean;

  @Input() loadedFromMainPage: boolean;

  testApplicantSearchData: any = {
    stateCode: 'GA',
    confirmation: 'GU5M6NLMIVG3',
    gCaptchaResponse: null
  }

  constructor(private dataService: DataService,
    private enrollmentService: EnrollmentService,
    private staticDataService: StaticDataService,
    private route: ActivatedRoute,
    private router: Router,
    private win: WindowService) { }

  ngOnInit() {
    this.setupForm();
    this.dataService.setRouteData(this.route.snapshot.data);
    this.getStates();
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  emit(applicant: Applicant) {
    this.searchResult.emit(applicant);
  }

  getAgency(stateCode: string, agencyId: string) {
    this.subs.push(this.dataService.getAgency(stateCode, agencyId)
    .subscribe(response=> {
        let agency = response.result;
        this.enrollmentService.setAgency(agency);
        this.enrollmentService.applicantProcessing.next(false);
        localStorage.setItem('agency', JSON.stringify(agency));
        this.router.navigate(['/applicant-review']);
    }, err=> {
      /* Are we displaying error message */
      console.log(err)
    }));
  }

  getStates() {
    return this.dataService.getStates().
    subscribe(response=> {
      this.states = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
    });
  }

  loadTestApplicant() {
    this.searchForm.patchValue(this.testApplicantSearchData);
  }

  setupForm() {
    this.searchForm = new FormGroup({
      confirmation: new FormControl(null, Validators.required),
      stateCode: new FormControl(null, Validators.required),
      gCaptchaResponse: new FormControl(null, Validators.required)
    });
    this.subs.push(this.searchForm.valueChanges.subscribe(value=> this.canSearch = true));
  }

  submitSearchForm() {
    this.enrollmentService.applicantProcessing.next(true);
    localStorage.setItem('applicantState', this.searchForm.value.stateCode);
    /* Search for applicant display message if not found emit applicant if found */
    this.subs.push(this.dataService.searchApplicantByConfirmation(this.searchForm.value)
    .subscribe(response=> {
      localStorage.setItem('applicant', JSON.stringify(response.result));
      this.enrollmentService.saveApplicant(response.result, true);
      this.enrollmentService.saveLoadedApplicant(response.result);
      this.getAgency(response.result.stateCode, response.result.transaction.reviewingAgencyId);
    }, err=> {
      /* Are we displaying error message */
      console.log(err)
      this.enrollmentService.applicantProcessing.next(false);
      timer(500).subscribe(()=> this.win.error.next(err));
      const captchaControl = this.searchForm.get('gCaptchaResponse');
      captchaControl.reset();
    }));
  }

}
