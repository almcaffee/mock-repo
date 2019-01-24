import { Component, OnInit } from '@angular/core';
import { StepperService } from '../stepper/stepper.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqResult } from '../../models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  faqs: FaqResult[] = [];
  subs: Subscription[] = [];

  constructor(private stepperService: StepperService,
    private enrollmentService: EnrollmentService,
    private windowService: WindowService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    /* Clear stored data on cancel/begin enrollment */
    localStorage.clear();
    this.stepperService.clearSteps();
    this.enrollmentService.clearApplicantInfo();
    this.dataService.setRouteData(this.route.snapshot.data);
    this.getFaqs();
  }

  getFaqs() {
    this.subs.push(this.dataService.getFaq()
    .subscribe(faqs=> {
      this.faqs = faqs;
    }, err=> {
      console.log(err)
    }));
  }

  getFaq(id: number) {
    this.router.navigate(['faq', id]);
  }

  startEnrollment() {
    this.stepperService.setRoute();
  }

}
