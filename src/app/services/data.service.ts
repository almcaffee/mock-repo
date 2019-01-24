import { Injectable, OnInit } from '@angular/core';
import { Subscription, Subject, Observable, of } from 'rxjs';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {
  AddressInfo,
  Agency,
  AgencyProfile,
  Applicant,
  AgencySubGroup,
  AgencyServiceLevel,
  CreditCardInfo,
  FaqResult,
  LoginInfo,
  PersonInfo,
  PaymentInfo,
  Privacy,
  RefData,
  NapsApiResponse,
  SiteLocation,
  State,
  TransactionInfo,
  ValidationError
} from '../models';
import { Title } from '@angular/platform-browser';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})

export class DataService implements OnInit {

  private API_URL: string;
  private routeDataSubject = new Subject<any>();
  routeDataSub$ = this.routeDataSubject.asObservable();

  constructor(private http: HttpClient, private title: Title, private windowService: WindowService) {
    this.setEndpoint();
  }

  ngOnInit() {}

  getAgenciesByState(stateCode: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'agency/state/'+stateCode);
  }

  getAgency(stateCode: string, agencyId: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'agency/state/'+stateCode+'/agencyId/'+agencyId);
  }

  getAgencyByName(stateCode: string, agencyName: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'agency/state/'+stateCode+'/name/'+agencyName);
  }

  getAgencyPrivacy(stateCode: string, privacyId: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'privacy/state/'+stateCode+'/privacyId/'+privacyId);
  }

  getAgencyProfile(stateCode: string, agencyId: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'agencyservicelevel/state/'+stateCode+'/id/'+agencyId);
  }

  getAgencyServiceLevel(stateCode: string, id: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'agencyservicelevel/state/'+stateCode+'/id/'+id);
  }

  getAgencyServiceLevels(stateCode: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'agencyservicelevel/state/'+stateCode);
  }

  getEmailContent(): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'config/email/content/enrollment');
  }

  getFaq(): Observable<FaqResult[]> {
    return this.http.get<FaqResult[]>('assets/files/faq.json');
  }

  getMailingAddress(stateCode: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'config/mailingaddress/state/'+stateCode);
  }

  getPaymentMethods(stateCode: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'paymentmethod/state/'+stateCode);
  }

  getStates(): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'config/states')
  }

  getStateSiteLocations(stateCode: string): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>('assets/files/site-locations.json');
  }

  searchApplicantByConfirmation(confirmationInfo: any): Observable<NapsApiResponse> {
    return this.http.get<NapsApiResponse>(this.API_URL+'applicant/state/'+confirmationInfo.stateCode+'/confirmation/'+confirmationInfo.confirmation);
  }

  searchApplicant(loginInfo: LoginInfo): Observable<NapsApiResponse> {
    return this.http.post<NapsApiResponse>(this.API_URL+'applicant/search'+'?g-recaptcha-response='+loginInfo.gCaptchaResponse, loginInfo);
  }

  resendConfirmation(resendInfo: any): Observable<NapsApiResponse> {
    return this.http.put<NapsApiResponse>(this.API_URL+'applicant/resendConfirmation', resendInfo);
  }

  /******************** App helper methods ********************/
  setEndpoint() {
    this.API_URL = this.windowService.API_URL+'/applicant-api/';
  }

  setRouteData(data: any) {
    this.title.setTitle(data.header);
    this.routeDataSubject.next(data);
  }

}
