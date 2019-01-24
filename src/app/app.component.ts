import { Component, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { DataService } from './services/data.service';
import { StaticDataService } from './services/static-data.service';
import { StepperService } from './components/stepper/stepper.service';
import { WindowService } from './services/window.service';
import { EnrollmentService } from './services/enrollment.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogueComponent } from './components/dialogue/dialogue.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  header: string;
  openMenu: boolean;
  stepper: boolean;
  processing: boolean;
  routeData: any = {};
  copyrightYear: number;
  subs: Subscription[] = [];
  MatDialogConfig: MatDialogConfig;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ds: DataService,
    private sds: StaticDataService,
    private ss: StepperService,
    private ws: WindowService,
    private cdr: ChangeDetectorRef,
    private es: EnrollmentService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.openMenu = false;
    this.copyrightYear = new Date().getFullYear();
    /*  Listen for route changes */
    this.subs.push(this.router.events
    .subscribe((event) => {
      /* Only do something when navigation ends (navigation has multple events) */
      if (event instanceof NavigationEnd) {
        this.openMenu = false;
        this.ss.getActiveStepFromRoute(this.router.url);
        this.scrollAppAnchorIntoView();
      }
    }));
    /* Get the route data to set the page title and app headline text */
    this.subs.push(this.ds.routeDataSub$.subscribe(data=> this.getRouteData(data)));
    this.subs.push(this.es.applicantEnrolledSub$.subscribe(enrollmentComplete=> this.setStepper(enrollmentComplete)));
    this.subs.push(this.es.applicantProcessingSub$.subscribe(processing=> this.displayProcessing(processing)));
    this.subs.push(this.ws.errorSub$.subscribe(data=> this.openDialog('error', data)));
    if(localStorage.getItem('applicant')) this.storeApplicant();
  }

  ngOnDestroy() {
    localStorage.clear();
    this.subs.forEach(s=> s.unsubscribe());
  }

  displayProcessing(processing: boolean) {
    if(processing) {
      this.processing = true;
    } else {
      timer(500).subscribe(()=> this.processing = false);
    }
  }

  getRouteData(data: any) {
    if(data) {
      this.routeData = data;
      if(data.header) this.header = data.header;
      this.stepper = data.stepper ? data.stepper : false;
      this.cdr.detectChanges();
    }
  }

  goToFaq() {
    let faqDiv = document.querySelector('#faq');
    if(faqDiv) {
      faqDiv.scrollIntoView();
    } else if(this.routeData.cancelDialogue && this.es.applicantChanged()) {
      this.openDialog('faq');
    } else {
      this.router.navigate(['/faq']);
    }
  }

  homeClicked() {
    if(this.routeData.cancelDialogue) {
      this.openDialog('cancel');
    } else {
      this.router.navigate(['/']);
    }
  }

  openDialog(type: string, args?: any) {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        dialogueType: type
      };

      if(args.error) dialogConfig.data['error'] = args.error;

      if(this.ws.width > 720) {
        dialogConfig.width = '600px';
      } else {
        dialogConfig.width = '80vw';
      }

      const dialogRef = this.dialog.open(DialogueComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        data => {
          if(data.continue) {
            if(dialogConfig.data.dialogueType === 'faq') {
              this.es.resetApplicant();
              this.router.navigate(['/faq']);
            } else if(args.redirect) {
              this.router.navigate([args.redirect]);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      );
  }

  setStepper(showStepper: boolean) {
    this.stepper = !showStepper;
    this.cdr.detectChanges();
  }

  /* Since Divs are fixed make sure the app div scrolls to top router navigate */
  scrollAppAnchorIntoView() {
    let anchor = document.querySelector('.naps-enrollment-top-anchor');
    if(anchor) anchor.scrollIntoView();
  }

  storeApplicant() {
    let applicant = JSON.parse(localStorage.getItem('applicant'));
    let agency = JSON.parse(localStorage.getItem('agency'));
    this.es.saveApplicant(applicant);
    this.es.saveLoadedApplicant(applicant);
    this.es.setAgency(agency);
    this.router.navigate(['/applicant-review']);
  }

  /* Show/Hide left menu */
  toggleMenu() {
    this.openMenu = !this.openMenu;
  }
}
