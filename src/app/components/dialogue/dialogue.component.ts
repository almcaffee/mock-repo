import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EnrollmentService } from '../../services/enrollment.service';
import { FormGroup, FormControl } from '@angular/forms';
import { WindowService } from '../../services/window.service';
import { Observable, Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})

export class DialogueComponent implements OnInit, OnDestroy {

  enrollmentComplete: boolean;
  feeChange: number;
  data: any;
  paymentMethod: any;
  paymentMethods: any[] = [];
  paymentDescription: string;
  subs: Subscription[] = [];

  constructor(private dialogRef: MatDialogRef<DialogueComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private enrollmentService: EnrollmentService,
    private dataService: DataService,
    public windowService: WindowService) {
      this.data = data;
  }

  ngOnInit() {
    this.enrollmentComplete = this.enrollmentService.applicantConfirmed();
    if(this.data.dialogueType === 'mailIn') this.calculateFeeDifference();
    if(this.data.dialogueType === 'confirmation' && this.data.agency) this.getPaymentMethods(this.data.agency.stateCode);
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  calculateFeeDifference() {
    let serviceLevel = this.enrollmentService.getAgencyServiceLevel();
    this.feeChange = serviceLevel.paperFee - serviceLevel.electronicFee;
  }

  continue(continueAction: boolean) {
    this.dialogRef.close({ continue: continueAction });
  }

  getPaymentMethods(stateCode: string) {
    this.subs.push(this.dataService.getPaymentMethods(stateCode)
    .subscribe(response=> {
      let paymentMethod = response.result;
      let method = paymentMethod.paymentMethods[this.data.applicant.payment.paymentMethod];
      let type = this.data.applicant.payment.paymentType ? method[method.indexOf(this.data.applicant.payment.paymentType)] : null;
      this.paymentDescription = type ? type : this.data.applicant.payment.paymentMethod;
    }, err=> {
      console.log(err);
    }));
  }

   print() {
     window.print();
   }

}
