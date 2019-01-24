import { Component, OnInit, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FaqResult } from '../../models';
import { Observable, Subscription, timer } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WindowService } from '../../services/window.service';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('panel') panels: QueryList<any>;
  faqId: number;
  faqs: FaqResult[] = [];
  subs: Subscription[] = [];
  previousFaqId: string;
  viewInitialized: boolean;
  back: boolean;

  constructor(private dataService: DataService,
    private enrollmentService: EnrollmentService,
    private windowService: WindowService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getAllFaq();
    this.route.params.subscribe(params => {
        if(params.id) {
          this.faqId = parseInt(params.id);
          if(this.viewInitialized && this.panels) this.viewFaq(this.faqId);
        }
    });
    let back = localStorage.getItem('previousRoute');
    if(back) this.back = true;
    this.dataService.setRouteData(this.route.snapshot.data);
  }

  ngAfterViewInit() {
    /* give the accodion a sec to get in view */
    if(!this.viewInitialized) {
      timer(500).subscribe(()=> this.viewFaq(this.faqId));
      this.viewInitialized = true;
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  getAllFaq() {
    this.subs.push(this.dataService.getFaq()
    .subscribe(faqs=> {
      this.faqs = faqs;
    }, err=> {
      console.log(err)
    }));
  }

  getFaq(id: string) {
    this.router.navigate(['/faq/'+id]);
  }

  viewFaq(id: number) {
    if(id) {
      this.panels.forEach((panel, index)=> {
        if(index - 1 === id) {
          panel['expanded'] = false;
        }
      });
      this.panels['_results'][id - 1]['expanded'] = true;
      this.windowService.window.document.querySelector('#faq-'+1).scrollIntoView();
    }
  }

}
