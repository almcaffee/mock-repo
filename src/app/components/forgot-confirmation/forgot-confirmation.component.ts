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
  selector: 'app-forgot-confirmation',
  templateUrl: './forgot-confirmation.component.html',
  styleUrls: ['./forgot-confirmation.component.css']
})
export class ForgotConfirmationComponent implements OnInit {

  searchForm: FormGroup;
  captchaForm: FormGroup;
  subs: Subscription[] = [];
  states: State[] = [];
  searchError: string;
  canSearch: boolean;
  linkSent: boolean;

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

  loadTestApplicant() {
    this.searchForm.patchValue({ stateCode: 'GA', email: 'johnston.olivia496@test.com'});
  }

  getStates() {
    return this.dataService.getStates().
    subscribe(response=> {
      this.states = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
    });
  }

  setupForm() {
    this.searchForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      stateCode: new FormControl(null, Validators.required)
    });
    this.subs.push(this.searchForm.valueChanges.subscribe(value=> this.canSearch = true));
    this.captchaForm = new FormGroup({
      gCaptchaResponse: new FormControl(null, Validators.required)
    });
  }

  submitSearchForm() {
    this.enrollmentService.applicantProcessing.next(true);
    /* Search for applicant display message if not found emit applicant if found */
    this.subs.push(this.dataService.resendConfirmation(this.searchForm.value)
    .subscribe(response=> {
      this.linkSent = true;
      this.enrollmentService.applicantProcessing.next(false);
      this.router.navigate(['/applicant-search']);
    }, err=> {
      /* Are we displaying error message */
      // console.log(err)
      this.enrollmentService.applicantProcessing.next(false);
      timer(500).subscribe(()=> this.win.error.next(err));
      const captchaControl = this.searchForm.get('gCaptchaResponse');
      captchaControl.reset();
    }));
  }

}
