import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { agencies, agencyServiceLevels, applicant, applicants, faq, mailingAddress, paymentTypes, privacy, siteLocations, states, paymentMethod } from './mock-data';
import { WindowService } from '../../services/window.service';
import { Applicant, Agency, Error } from '../../models';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

    constructor(private ws: WindowService) { }

    confirmApplicant(applicant: Applicant): Applicant {
      applicant.id = "5b3e5fa146e0fb00018f72c2";
      applicant.status = "REGISTERED";
      applicant.confirmation = "UCBHFQW6D7J5";
      applicant.qrCode = "iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9AQAAAACn+1GIAAAA80lEQVR42u3VMQ7DIAwFUEsM2coFKnENb5ypF0jgAnAltlwDiQswMkS4ztI2E2ZrpVoZojcQ88EK0LUa/OFrwYGKZAKAFkOkEpPqll+kEKD4VjqqKXCYb5NQ0YQZ4E6dpWvrA+A8ApZrQAPg6kvWl2MYgG+qY9721xpjoGaITGyKxNCxVAtcmxgoHY9GPuUZgG03dTnk4PAAPqVmohg6cOR5xffmhkD7HRZeKWsxeFIVi4MJOJu1Z+pRDHyDiOCGn2M6gHPmGj+v1MdwzlwyDgrNAF+6Fe56BioYt3x+dgDcqU8ULMiB83A2rzZrMfx/BT8ATwW0YFzRNL3GAAAAAElFTkSuQmCC";
      return applicant;
    }

    validateApplicant(applicant: Applicant): Error[] {
      let errors: Error[] = [];
      if(!applicant.transaction.reviewingAgencyId) errors.push({ field: 'reviewingAgencyId', message: 'Reviewing agency id required', required: true });
      if(!applicant.transaction.reason) errors.push({ field: 'reason', message: 'Reason required', required: true });
      if(!applicant.transaction.reviewingAgency) errors.push({ field: 'reviewingAgency', message: 'Reviewing agency required', required: true });
      if(!applicant.payment.paymentMethod) errors.push({ field: 'paymentMethod', message: 'Payment method required', required: true });
      if(!applicant.person.lastName) errors.push({ field: 'lastName', message: 'Last name required', required: true });
      if(!applicant.person.firstName) errors.push({ field: 'firstName', message: 'First name required', required: true });
      if(!applicant.person.dateOfBirth) errors.push({ field: 'dateOfBirth', message: 'Date of birth required', required: true });
      if(!applicant.person.weight) errors.push({ field: 'weight', message: 'Weight required', required: true });
      if(!applicant.person.gender) errors.push({ field: 'gender', message: 'Gender required', required: true });
      if(!applicant.person.race) errors.push({ field: 'race', message: 'Race required', required: true });
      if(!applicant.person.eyeColor) errors.push({ field: 'eyeColor', message: 'Eye color required', required: true });
      if(!applicant.person.hairColor) errors.push({ field: 'hairColor', message: 'Hair color required', required: true });
      if(!applicant.person.height) errors.push({ field: 'height', message: 'Height required', required: true });
      if(!applicant.person.placeOfBirth) errors.push({ field: 'placeOfBirth', message: 'Place of birth required', required: true });
      if(!applicant.person.email) errors.push({ field: 'email', message: 'Email required', required: true });
      if(!applicant.address.address1) errors.push({ field: 'address1', message: 'Address required', required: true });
      if(!applicant.address.city) errors.push({ field: 'city', message: 'City required', required: true });
      if(!applicant.address.state) errors.push({ field: 'state', message: 'State required', required: true });
      if(!applicant.address.zip) errors.push({ field: 'zip', message: 'Zip required', required: true });
      return errors.length ? errors : null;
    }

    interceptParams(url: string): any {
      let params: any = {};
      let paramArray: string[] = [];
      // Lets break our url into params
      let staticDomainToSlice = this.ws.API_URL+'/applicant-api/';
      let staticControllerSlices = ['admin', 'agency', 'agencyservicelevel', 'applicant', 'config', 'enroll', 'mailingaddress', 'paymentmethod', 'privacy', 'printsite', 'search', 'states', 'update'];
      let urlDynamicParts = url.slice(staticDomainToSlice.length).split('/');
      // push only dynamic key/values to new array
      urlDynamicParts.forEach((p, i)=> {
        if(staticControllerSlices.indexOf(p) === -1) {
          paramArray.push(p);
        }
      });
      // populate params
      paramArray.forEach((p, i)=>{
        if(i%2 != 0 && i != 0) {
          params[paramArray[i-1]] = p;
        }
      });
      return params;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let params = this.interceptParams(request.url);
        // console.log(request.url)
        if(Object.keys(params).length) {
          // console.log(params)
        } else if(request.body && Object.keys(request.body).length) {
          // console.log(request.body)
        }

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

          /* Agency Controller */

          // get state agencies
          if (request.url.match(/\/agency\/state\/([A-Z]{2})+$/) && request.method === 'GET') {
            let stateAgencies = agencies.filter(a=> a.stateCode === params.state);
            if(!stateAgencies.length) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No agencies found for this state', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Agencies found', result: agencies } }));
            }
          }

          // get state agency by id
          if (request.url.match(/\/agency\/state\/([A-Z]{2})\/agencyId\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            let agency = agencies.find(a=> a.id === params.agencyId);
            if(!agency) {
              return throwError({ errorCode:'NOT_FOUND',  message: 'Agency not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: '', result: agency } }));
            }
          }

          // get state agency by name
          if (request.url.match(/\/agency\/state\/([A-Z]{2})\/name\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            let agency = agencies.find(a=> a.name === params.name);
            if(!agency) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Agency not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: '', result: agency } }));
            }
          }

          /* Agency Service Level Controller */

          // get state service levels
          if (request.url.match(/\/agencyservicelevel\/state\/([A-Z]{2})+$/) && request.method === 'GET') {
            let serviceLevels = agencyServiceLevels.filter(asl=> asl.stateCode === params.state);
            if(!serviceLevels.length) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No service levels found for '+params.state, result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Service levels found', result: serviceLevels } }));
            }
          }

          // get service level by id
          if (request.url.match(/\/agencyservicelevel\/state\/([A-Z]{2})\/id\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            let serviceLevel = agencyServiceLevels.find(asl=> asl.id === params.id);
            if(!serviceLevel) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Service level not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Service level found', result: serviceLevel } }));
            }
          }

          // get service level by name
          if (request.url.match(/\/agencyservicelevel\/state\/([A-Z]{2})\/name\/([a-zA-Z0-9- ])+$/) && request.method === 'GET') {
            let serviceLevel = agencyServiceLevels.find(asl=> asl.name === params.name);
            if(!serviceLevel) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Service level not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Service level found', result: serviceLevel } }));
            }
          }

          /* Applicant Config Controller */
          if (request.url.match(/\/config\/email\/content\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: { message: 'Email content found', result: '' } }));
          }

          // get faq
          if (request.url.endsWith('/config/faq') && request.method === 'GET') {
            // store localstorage item in unit test to throw faq error
            let throwFaqError = localStorage.getItem('faqError');
            if(throwFaqError) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Faqs not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Faqs found', result: faq } }));
            }
          }

          // get faq
          if (request.url.endsWith('assets/files/faq.json') && request.method === 'GET') {
            // store localstorage item in unit test to throw faq error
            let throwFaqError = localStorage.getItem('faqError');
            if(throwFaqError) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Faqs not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Faqs found', result: faq } }));
            }
          }

          if (request.url.match(/\/config\/mailingaddress\/state\/([A-Z]{2})+$/) && request.method === 'GET') {
            let state = states.find(s=> s.stateCode === params.state);
            if(!state) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No mailing address found for '+params.state, result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Mailing address found', result: mailingAddress } }));
            }
          }

          if (request.url.match(/\/config\/paymentmethod\/state\/([A-Z]{2})+$/) && request.method === 'GET') {
            let throwPaymentTypesError = localStorage.getItem('paymentTypesError');
            if(throwPaymentTypesError) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No payment methods found for '+params.state, result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Payment methods found', result: paymentMethod } }));
            }
          }

          if (request.url.match(/\/config\/printsite\/state\/([A-Z]{2})+$/) && request.method === 'GET') {
            let state = states.find(s=> s.stateCode === params.state);
            if(!state) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No sites found for '+params.state, result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Print sites found', result:  siteLocations } }));
            }
          }

          if (request.url.endsWith('/config/states') && request.method === 'GET') {
            let statesError = localStorage.getItem('statesError');
            if(statesError) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'States not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Found states', result: JSON.stringify([{ stateCode: "FL", name :"Florida" }, { stateCode: "GA",  name: "Georgia" }]) } }));
            }
          }

          /* Applicant Controller */

          // enroll
          if (request.url.indexOf('/applicant/enroll') > -1 && request.method === 'POST') {
            // console.log('enroll endpoint')
            let errors = this.validateApplicant(request.body);
            if(errors) {
              return throwError({ errorCode: 'INVALID_REQUEST_DATA',  message: 'INVALID_REQUEST_DATA', result: null });
            } else {
              let confirmedApplicant = Object.assign(applicants[0], { person: request.body.person, transaction: request.body.transaction, payment: request.body.payment, address: request.body.address });
              return of(new HttpResponse({ status: 200, body: { message: 'Enrollment successful', result: confirmedApplicant } }));
            }
          }

          // update enrollment
          if (request.url.indexOf('/applicant/update') > -1 && request.method === 'PUT') {
            let errors = this.validateApplicant(request.body);
            if(errors) {
              return throwError({ errorCode: 'INVALID_REQUEST_DATA',  errors: errors, message: 'Invalid request data', result: null });
            } else {
              let confirmedApplicant = Object.assign(applicants[0], { person: request.body.person, transaction: request.body.transaction, payment: request.body.payment, address: request.body.address });
              return of(new HttpResponse({ status: 200, body: { message: 'Enrollment successful', result: confirmedApplicant } }));
            }
          }

          // search applicant
          if (request.url.match(/\/applicant\/state\/([A-Z]{2})\/firstName\/[a-zA-Z]\/lastName\/[a-zA-Z]\/confirmation\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            let applicant = applicants.find(a=> a.confirmation === params.confirmation && a.person.lastName === params.lastName && a.person.firstName === params.firstName && a.person.email === params.email && a.stateCode === params.stateCode);
            if(!applicant) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'NOT_FOUND', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: '', result: applicant } }));
            }
          }

          // search applicant
          if (request.url.indexOf('/applicant/search') > -1 && request.method === 'POST') {
            let applicant = applicants.find(a=> a.confirmation === request.body.confirmation && a.person.lastName === request.body.lastName && a.person.firstName === request.body.firstName && a.stateCode === request.body.stateCode);
            if(!applicant) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Applicant not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Applicant found', result: applicant } }));
            }
          }

          // search applicant
          if (request.url.match(/\/applicant\/state\/([A-Z]{2})\/confirmation\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            let applicant = applicants.find(a=> a.confirmation === params.confirmation &&  a.stateCode === params.stateCode);
            if(!applicant) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'Applicant not found', result: null });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Applicant found', result: applicant } }));
            }
          }

          // search applicant
          if (request.url.indexOf('/applicant/resendConfirmation') > -1 && request.method === 'PUT') {
            return of(new HttpResponse({ status: 200, body: { message: 'Confirmation sent to email', result: applicant } }));
          }

          if (request.url.match(/\/applicant\/state\/([A-Z]{2})\/id\/([a-zA-Z0-9])+$/) && request.method === 'DELETE') {
            let applicant = applicants.find(a=> a.stateCode === params.stateCode && a.id=== params.id);
            if(applicant) {
              return throwError({ errorCode: 'NOT_FOUND', message: 'Delete unsuccessful' });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Delete successful', result: null } }));
            }
          }

          /* Privacy Controller */

          if (request.url.match(/\/privacy\/state\/([A-Z]{2})+$/) && request.method === 'GET') {
            let state = states.find(s=> s.stateCode === params.state);
            if(!state) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No privacy list found for '+params.state });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: '', result: [privacy] } }));
            }
          }

          if (request.url.match(/\/privacy\/state\/([A-Z]{2})\/privacyId\/([a-zA-Z0-9])+$/) && request.method === 'GET') {
            let state = states.find(s=> s.stateCode === params.state);
            if(!state) {
              return throwError({ errorCode: 'NOT_FOUND',  message: 'No privacy found this agency' });
            } else {
              return of(new HttpResponse({ status: 200, body: { message: 'Privacy found', result: privacy } }));
            }
          }

          // pass through any requests not handled above
          return next.handle(request);

        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let mockBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockBackendInterceptor,
    multi: true
};
