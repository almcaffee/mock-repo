import { Component, OnInit, OnDestroy, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AddressInfo,
  Agency,
  AgencyProfile,
  Applicant,
  AgencyServiceLevel,
  CreditCardInfo,
  PersonInfo,
  PaymentInfo,
  RefData,
  State,
  StatePaymentMethod,
  TransactionInfo,
  ValidationError
} from '../../models';
import { DataService } from '../../services/data.service';
import { StepperService } from '../stepper/stepper.service';
import { StaticDataService } from '../../services/static-data.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { WindowService } from '../../services/window.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogueComponent } from '../dialogue/dialogue.component';
import * as moment from 'moment';

@Component({
  selector: 'payment-information',
  templateUrl: './payment-information.component.html',
  styleUrls: ['./payment-information.component.css']
})
export class PaymentInformationComponent implements OnInit {

  applicant: Applicant;
  agency: Agency;
  serviceLevel: AgencyServiceLevel;
  paymentInfo: PaymentInfo;
  creditCardInfo: CreditCardInfo;
  mailInPayment: boolean;
  paymentAccepted: boolean;
  editPayment: boolean = false;
  privacyAgency: string;
  privacyAgencyId: string;
  enrollmentForm: FormGroup;
  eCheckForm: FormGroup;
  creditCardForm: FormGroup;
  eCheck: boolean;
  creditCard: boolean;
  onSite: boolean;
  enrollmentComplete: boolean;
  enrollmentFormOptionDefault: RefData = { value: null, name: 'SELECT' };
  paymentMethods: any[] = [];
  paymentMethod: StatePaymentMethod;
  applicablePaymentMethods: any[] = [];
  price: number;
  brand: string;
  selectKeys: any[] = [];
  discountApplied: boolean;
  states: State[] = [];
  subs: Subscription[] = [];
  applicantUpdated: boolean;
  selectedPaymentMethod: any;

  constructor(public dataService: DataService,
    private stepperService: StepperService,
    private staticDataService: StaticDataService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private router: Router,
    public windowService: WindowService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getApplicant();
    this.getAgency();
    this.getStates();
    this.setupForm();
    this.applicantUpdated = this.enrollmentService.applicantChanged();
    this.dataService.setRouteData(this.route.snapshot.data);
    this.enrollmentComplete = this.enrollmentService.applicantEnrollmentComplete;
  }

  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  /* For Demo Only populates user from assets/files/applicant.json file*/
  demoApplicantData() {
    if(this.enrollmentForm) {
      let paymentInfo = this.staticDataService.applicant.payment;
      paymentInfo.amount = this.price;
      this.populatePaymentInfo(paymentInfo, true);
    }
  }

  editPaymentInfo() {
    this.editPayment = !this.editPayment;
    if(!this.editPayment) {
      this.paymentAccepted = true;
      if(this.applicant && this.applicant.confirmation) this.getPaymentInfo();
    } else {
      this.paymentAccepted = false;
    }
  }

  /* Get selected agency from privacy form in localstorage */
  getAgency() {
    this.agency = this.enrollmentService.getAgency();
  }

  getApplicant() {
    let applicant = this.enrollmentService.getApplicant();
    if(applicant) {
      this.applicant = applicant;
      this.getPaymentMethods(this.applicant.stateCode);
      this.getFingerprintCardUser();
    }
  }

  getFingerprintCardUser() {
    this.mailInPayment = this.enrollmentService.getFingerprintCardUser();
    if(this.mailInPayment) {
      this.price = this.applicant.transaction.reviewingAgencyServiceLevel.paperFee;
    } else {
      this.price = this.applicant.transaction.reviewingAgencyServiceLevel.electronicFee;
    }
  }

  getPaymentInfo() {
    if(this.applicant && this.applicant.payment) {
      this.populatePaymentInfo(this.applicant.payment);
      this.paymentAccepted = true;
    }
  }

  getPaymentMethods(stateCode: string) {
    this.subs.push(this.dataService.getPaymentMethods(stateCode)
    .subscribe(response=> {
      this.paymentMethod = response.result;
      if(this.paymentMethod && this.paymentMethod.paymentMethods) this.selectKeys = Object.keys(this.paymentMethod.paymentMethods);
    }, err=> {
      console.log(err);
    }));
  }

  populatePaymentInfo(paymentInfo: PaymentInfo, demo?: boolean) {
    // dont try to patch null values to form
    if(demo) this.applicant.payment = paymentInfo;
    if(paymentInfo) {
      Object.keys(paymentInfo).forEach(k=> {
        if(paymentInfo[k]) {
          let control = this.enrollmentForm.get(k);
          control.patchValue(paymentInfo[k]);
        }
      });
    }
  }

  getStates() {
    this.subs.push(this.dataService.getStates().
    subscribe(response=> {
      this.states = typeof response.result === 'string' ? JSON.parse(response.result) : response.result;
    }, err=> {
      console.log(err)
    }));
  }

  /* Call stepper service to go back a step */
  goToPreviousStep() {
    this.stepperService.goToPreviousStep();
  }

  /* Reset form and invalid field array */
  resetEnrollmentForm() {
    this.enrollmentForm.reset();
  }

  clearPaymentType() {
    if(this.applicant.confirmation) this.paymentAccepted = true;
    const pt = this.enrollmentForm.get('paymentType');
    pt.patchValue(null);
    const cc = this.enrollmentForm.get('creditCard');
    cc.reset();
    const ba = this.enrollmentForm.get('billingAddress');
    ba.reset();
  }

  setPaymentMethod(name: string, subscription?: boolean) {
    if(this.paymentMethod && this.paymentMethod.paymentMethods) {
      let mthds =  Object.keys(this.paymentMethod.paymentMethods);
      if(mthds.length) {
        let pmName = mthds.find(pm=> pm === name);
        this.selectedPaymentMethod = this.paymentMethod.paymentMethods[pmName];
      }
    }
    this.editPayment = false;
    this.paymentAccepted = false;
    switch (name) {
      case 'MAIL_IN':
        this.mailInPayment = true;
        this.onSite = false;
        this.creditCard = false;
        this.eCheck = false;
        this.clearPaymentType();
        break;
      case 'ON_SITE':
        this.mailInPayment = false;
        this.onSite = true;
        this.creditCard = false;
        this.eCheck = false;
        this.clearPaymentType();
        break;
      case 'ELECTRONIC':
        this.mailInPayment = false;
        this.onSite = false;
        this.creditCard = false;
        this.eCheck = false;
        if(this.applicant.payment && this.applicant.payment.paymentMethod === name) this.setPaymentType(this.applicant.payment.paymentType);
        break;
    }

    // if(this.applicant.confirmation) this.enrollmentForm.patchValue(this.applicant.payment);

  }

  setPaymentType(type: string, subscription?: boolean) {
    if(type) {
      const typeControl = this.enrollmentForm.get('paymentType');
      if(!typeControl.value && !subscription) typeControl.patchValue(type);
      if(type === 'ECHECK') {
        this.eCheck = true;
        this.creditCard = false;
      } else if(type === 'CREDIT_CARD') {
        this.eCheck = false;
        this.creditCard = true;
      }
    }
  }

  // We should update this with server communication
  checkCode(event: any){
    if(event.target.value == 'ABCD') {
      this.price = 0.00
      this.discountApplied = true
    } else {
      this.discountApplied = false
    }
  }

  luhn_validate(imei: string) {
      return !/^\d+$/.test(imei) || (imei.split('').reduce(function(sum, d, n){
              return n===(imei.length-1)
                     ? 0
                     : sum + parseInt((n%2)? d: [0,2,4,6,8,1,3,5,7,9][d]);
          }, 0)) % 10 == 0;
  };

  getCreditCardBrand(cardBrand: string) {
    // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
    // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also

    if(cardBrand) {
      //JCB
      let jcbRegex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)
      // American Express
      let amexRegex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
      // Diners Club
      let dinersRegex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39
      // Visa
      let visaRegex = new RegExp('^4[0-9]{0,}$'); //4
      // MasterCard
      let mastercardRegex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
      let maestroRegex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
      //Discover
      let discoverRegex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
      ////6011, 622126-622925, 644-649, 65


      // get rid of anything but numbers
      cardBrand = cardBrand.replace(/\D/g, '');

      // checks per each, as their could be multiple hits
      if (cardBrand.match(jcbRegex)) {
        this.brand = "jcb";
      } else if (cardBrand.match(amexRegex)) {
        this.brand = "amex";
      } else if (cardBrand.match(dinersRegex)) {
        this.brand = "dinerclub";
      } else if (cardBrand.match(visaRegex)) {
        this.brand = "visa";
      } else if (cardBrand.match(mastercardRegex)) {
        this.brand = "master";
      } else if (cardBrand.match(discoverRegex)) {
        this.brand = "discover";
      } else if (cardBrand.match(maestroRegex)) {
        if (cardBrand[0] == '5') { //started 5 must be mastercard
          this.brand = "master"; //mastercard
        } else {
          this.brand = "master"; //maestro (mastercard) is all 60-69 which is not something else, thats why this condition in the end
        }
      } else {
        this.brand = null;
      }

      const cardType = this.enrollmentForm.get('creditCard').get('cardType');
      cardType.patchValue(this.brand);
    }

  }

  validateCreditCardNumber(control: FormControl): any {
    let value = control.value;
    if(value) {
      // accept only digits, dashes or spaces
    	if (/[^0-9-\s]+/.test(value)) {
        return false;
      }

    	// The Luhn Algorithm. It's so pretty.
    	let nCheck = 0, nDigit = 0, bEven = false;
    	value = value.replace(/\D/g, "");

    	for (let n = value.length - 1; n >= 0; n--) {
    		let cDigit = value.charAt(n),
    			  nDigit = parseInt(cDigit, 10);

    		if (bEven) {
    			if ((nDigit *= 2) > 9) nDigit -= 9;
    		}

    		nCheck += nDigit;
    		bEven = !bEven;
    	}

    	return (nCheck % 10) === 0;
    } else {
      return false;
    }

  }

  /* Create Enrollment Form Group */
  setupForm() {
    this.enrollmentForm = new FormGroup({
      amount: new FormControl(this.price, Validators.required),
      paymentMethod: new FormControl(null, Validators.required),
      paymentType: new FormControl(),
      hashCC: new FormControl(),
      verifyTransaction: new FormControl(),
      creditCard: new FormGroup({
        cardType: new FormControl(),
        cardHolder: new FormControl(null, Validators.required),
        cardNumber: new FormControl(null, [Validators.pattern('^[0-9]*$'), this.validateCreditCardNumber]),
        cvv: new FormControl(null, [Validators.pattern('^[0-9]*$')]),
        expirationDate: new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.minLength(4), Validators.maxLength(4)])
      }),
      eCheck: new FormControl(),
      // eCheck: new FormGroup({
      //   date: new FormControl({ value: null, disable: true }, Validators.required),
      //   name: new FormControl({ value: null, disable: true }, Validators.required),
      //   routingNumber: new FormControl({ value: null, disable: true }, Validators.required),
      //   accountNumber: new FormControl({ value: null, disable: true }, Validators.required),
      //   signature: new FormControl({ value: null, disable: true },Validators.required)
      // }),
      billingAddress: new FormGroup({
        address1:	new FormControl(null, Validators.required),
        address2:	new FormControl(),
        city:	new FormControl(null, Validators.required),
        suite: new FormControl(),
        state: new FormControl(null, Validators.required),
        zip: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')])
      })
    });

    const paymentMethod = this.enrollmentForm.get('paymentMethod');
    this.subs.push(paymentMethod.valueChanges.subscribe(
      method => this.setPaymentMethod(method, true)
    ));
    const paymentType = this.enrollmentForm.get('paymentType');
    this.subs.push(paymentType.valueChanges.subscribe(
      type => this.setPaymentType(type, true)
    ));
    const cardNumber = this.enrollmentForm.get('creditCard').get('cardNumber');
    this.subs.push(cardNumber.valueChanges.subscribe(
      number => this.getCreditCardBrand(number)
    ));

    if(this.applicant.payment && this.applicant.payment.paymentMethod) {
      paymentMethod.patchValue(this.applicant.payment.paymentMethod);
      this.getPaymentInfo();
    }

    this.enrollmentForm.valueChanges.subscribe(()=> console.log(this.enrollmentForm));

  }

  /* Submit form */
  submitEnrollmentForm() {
    /* Form Validated */
    // Save updated value or null
    if(this.applicant.confirmation && !this.editPayment) {
      this.enrollmentService.setPaymentInfo(this.applicant.payment);
    } else {
      let applicant = this.enrollmentForm.value;
      if(this.onSite || this.mailInPayment) {
        delete applicant['paymentType'];
        delete applicant['creditCard'];
        delete applicant['billingAddress'];
      }
      // let applicant = this.onSite || this.mailInPayment ? Object.assign({}, this.enrollmentForm.value, { creditCard: null, billingAddress: null }) : this.enrollmentForm.value;
      this.enrollmentService.setPaymentInfo(applicant, true);
    }
    this.stepperService.completeStep();
  }

  togglePaymentAcceptance(event: any) {
    this.paymentAccepted = event.checked;
  }

  openDialog() {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        dialogueType: 'cancel'
      };

      if(this.windowService.width > 720) {
        dialogConfig.width = '600px';
      } else {
        dialogConfig.width = '80vw';
      }

      const dialogRef = this.dialog.open(DialogueComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        data => {
          if(data.continue) {
            if(this.enrollmentService.applicantEnrollmentComplete) {
              this.enrollmentService.resetApplicant();
              this.router.navigate(['/applicant-review']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      );
  }

}
