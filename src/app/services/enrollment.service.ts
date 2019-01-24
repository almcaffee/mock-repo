import { Injectable, OnInit } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AddressInfo,
  Agency,
  AgencyProfile,
  AgencyServiceLevel,
  Applicant,
  PaymentInfo,
  PersonInfo,
  RefData,
  NapsApiResponse,
  State,
  TransactionInfo,
  ValidationError
} from '../models';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService implements OnInit {

  private API_URL: string;
  private agency: Agency;
  private state: State;
  private applicant: Applicant;
  private loadedApplicant: Applicant;
  private defaultApplicant: Applicant = {
    id: null,
    confirmation: null,
    stateCode: null,
    status: null,
    transaction: null,
    person: null,
    address: null,
    payment: null
  };

  applicantEnrolled = new Subject<boolean>();
  applicantEnrolledSub$ = this.applicantEnrolled.asObservable();
  applicantProcessing = new Subject<boolean>();
  applicantProcessingSub$ = this.applicantProcessing.asObservable();
  applicantLoaded: boolean;
  applicantEnrollment: boolean;
  applicantEnrollmentComplete: boolean;
  fingerPrintCardUser: boolean;
  fingerPrintCardUserSelected: boolean;

  constructor(private http: HttpClient, private windowService: WindowService) {
    this.setEndpoint();
  }

  ngOnInit() {}

  applicantChanged(): boolean {

    let changed: boolean = false;
    let obj2 = this.loadedApplicant;
    let obj1 = this.applicant;
    Object.keys(obj1).forEach(k=> {
      if(obj1[k] && typeof obj1[k] === 'object') {
        Object.keys(obj1[k]).forEach(key=> {
          if(obj1[k][key] && typeof obj1[k][key] === 'object') {
            Object.keys(obj1[k][key]).forEach(kk=> {
              if((!obj2[k][key][kk] || obj1[k][key][kk] != obj2[k][key][kk]) && !(!obj1[k][key][kk] && !obj2[k][key][kk])) {
                changed = true;
              }
            });
          } else if((!obj2[k][key] || obj1[k][key] != obj2[k][key]) && !(!obj1[k][key] && !obj2[k][key])) {
            changed = true;
          }
        });
      } else if((!obj2[k] || obj1[k] != obj2[k]) && !(!obj1[k] && !obj2[k])) {
        changed = true;
      }
    });
    return changed;
  }

  applicantConfirmed(): boolean {
    return this.applicant && this.applicant.confirmation ? true : false;
  }

  clearApplicantInfo() {
    this.agency = null;
    this.applicant = null;
    this.applicantLoaded = null;
    this.applicantEnrollmentComplete = null;
    this.state = null;
  }

  clearApplicantSearch() {
    this.applicantLoaded = null;
    this.applicantEnrollmentComplete = null;
  }

  enrollmentComplete(): boolean {
    return this.applicantEnrollmentComplete;
  }

  getApplicant(): Applicant {
    return this.applicant;
  }

  getAgency(): Agency {
    return this.agency;
  }

  getState(): State {
    return this.state;
  }

  getAddressInfo(): AddressInfo {
    return this.applicant && this.applicant.address ? this.applicant.address : null;
  }

  getAgencyServiceLevel(): AgencyServiceLevel {
    return this.applicant.transaction.reviewingAgencyServiceLevel;
  }

  getFingerprintCardUser(): boolean {
    return this.fingerPrintCardUser;
  }

  getPaymentInfo(): PaymentInfo {
    return this.applicant && this.applicant.payment ? this.applicant.payment : null;
  }

  getPersonInfo(): PersonInfo {
    return this.applicant && this.applicant.person ? this.applicant.person : null;
  }

  getTransactionInfo(): TransactionInfo {
    return this.applicant && this.applicant.transaction ? this.applicant.transaction : null;
  }

  setAgency(agency: Agency) {
    if(agency) this.agency = agency;
  }

  setPaymentInfo(payment: PaymentInfo, strict?: boolean) {
    if(!this.applicant) this.applicant = this.defaultApplicant;
    if(strict) {
      this.applicant.payment = payment;
    } else if(payment) {
      this.applicant.payment = Object.assign({}, this.applicant.payment, payment);
    }
  }

  resetApplicant() {
    if(this.loadedApplicant) this.applicant = this.loadedApplicant;
  }

  resetApplicantPerson() {
    if(this.loadedApplicant) this.applicant.person = this.loadedApplicant.person;
  }

  resetApplicantPayment() {
    if(this.loadedApplicant) this.applicant.payment = this.loadedApplicant.payment;
  }

  resetApplicantTransaction() {
    if(this.loadedApplicant) this.applicant.transaction = this.loadedApplicant.transaction;
  }

  setFingerprintCardUser(cardUser: boolean, type?: string) {
    this.fingerPrintCardUser = cardUser;
    this.fingerPrintCardUserSelected = true;
  }

  setPaymentAmount(amount: string) {
    if(amount) {
      if(!this.applicant) this.applicant = this.defaultApplicant;
      if(!this.applicant.payment) this.applicant.payment = { amount: null };
      this.applicant.payment = Object.assign({}, this.applicant.payment, { amount: amount });
    }
  }

  setPaymentType(paymentType: string) {
    if(paymentType) {
      if(!this.applicant) this.applicant = this.defaultApplicant;
      if(!this.applicant.payment) this.applicant.payment = { paymentType: null };
      this.applicant.payment = Object.assign({}, this.applicant.payment, { paymentType: paymentType });
    }
  }

  setPersonInfo(person: PersonInfo) {
    if(person) {
      if(!this.applicant) this.applicant = this.defaultApplicant;
      this.applicant.person = person;
    }
  }

  setState(state: State) {
    if(state) this.state = state;
  }

  setStateCode(stateCode: string) {
    if(stateCode) {
      if(!this.applicant) this.applicant = this.defaultApplicant;
      this.applicant.stateCode = stateCode;
    }
  }

  setTransactionInfo(transaction: TransactionInfo) {
    if(transaction) {
      if(!this.applicant) this.applicant = this.defaultApplicant;
      this.applicant.transaction = transaction;
    }
  }

  saveApplicant(applicant: Applicant, applicantEnrollment?: boolean) {
    this.applicant = Object.assign({}, this.applicant, applicant);
    if(applicantEnrollment) this.applicantEnrollment = true;
    if(applicant.confirmation) this.applicantEnrollmentComplete = true;
  }

  saveLoadedApplicant(applicant: Applicant) {
    this.loadedApplicant = applicant;
    this.applicantLoaded = true;
    this.applicantEnrollmentComplete = true;
    if(applicant.payment.paymentMethod === 'MAIL_IN') {
      this.fingerPrintCardUser = true;
      this.fingerPrintCardUserSelected = true;
    }
  }

  setEndpoint() {
    this.API_URL = this.windowService.API_URL+'/applicant-api/applicant/';
  }

  deleteEnrollment(): Observable<NapsApiResponse> {
    return this.http.delete<NapsApiResponse>(this.API_URL+'state/'+this.applicant.stateCode+'/id/'+this.applicant.id);
  }

  submitEnrollment(applicant: Applicant, captchaResponse: string): Observable<NapsApiResponse> {
    return this.http.post<NapsApiResponse>(this.API_URL+'enroll?g-recaptcha-response='+captchaResponse, applicant);
  }

  updateEnrollment(applicant: Applicant, captchaResponse: string): Observable<NapsApiResponse> {
    return this.http.put<NapsApiResponse>(this.API_URL+'update?g-recaptcha-response='+captchaResponse, applicant);
  }

}
