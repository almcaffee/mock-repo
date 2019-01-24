import { TestBed, inject, async, ComponentFixture } from '@angular/core/testing';

import { EnrollmentService } from './enrollment.service';
import { HttpClientModule } from '@angular/common/http';
import { applicants } from '../core/testing/mock-data';

describe('EnrollmentService', () => {

let nullApplicant: any = {
  id: null,
  confirmation: null,
  stateCode: null,
  status: null,
  transaction: null,
  person: null,
  address: null,
  payment: null
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EnrollmentService]
    });
  });

  it('should be created', inject([EnrollmentService], (service: EnrollmentService) => {
    expect(service).toBeTruthy();
  }));

  it('should set applicant to null', inject([EnrollmentService], (service: EnrollmentService) => {
    service.clearApplicantInfo();
    expect(service['applicant']).toBeNull();
  }));

  it('should save applicant', inject([EnrollmentService], (service: EnrollmentService) => {
    service.saveApplicant(applicants[0]);
    expect(service['applicant']).toEqual(applicants[0]);
  }));

  it('should save transaction info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.clearApplicantInfo();
    let applicantTransactionOnly = applicants[0].transaction;
    service.setTransactionInfo(applicants[0].transaction);
    let appl = service.getTransactionInfo();
    expect(appl).toEqual(applicantTransactionOnly);
  }));

  it('should save payment info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.clearApplicantInfo();
    let applicantPaymentOnly = applicants[0].payment;
    service.setPaymentInfo(applicantPaymentOnly);
    let appl = service.getPaymentInfo();
    expect(appl).toEqual(applicantPaymentOnly);
  }));

  it('should set applicant biographical info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.clearApplicantInfo();
    let applicantBioOnly = applicants[0].person;
    service.setPersonInfo(applicants[0].person);
    let appl = service.getPersonInfo();
    expect(appl).toEqual(applicantBioOnly);
  }));

  it('should get applicant', inject([EnrollmentService], (service: EnrollmentService) => {
    service.saveApplicant(applicants[0]);
    let appl = service.getApplicant();
    expect(appl).toEqual(applicants[0]);
  }));

  it('should get address info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.saveApplicant(applicants[0]);
    let address = service.getAddressInfo();
    expect(address).toEqual(applicants[0].address);
  }));

  it('should get transaction info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.saveApplicant(applicants[0]);
    let transaction = service.getTransactionInfo();
    expect(transaction).toEqual(applicants[0].transaction);
  }));

  it('should get payment info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.saveApplicant(applicants[0]);
    let payment = service.getPaymentInfo();
    expect(payment).toEqual(applicants[0].payment);
  }));

  it('should get applicant biographical info', inject([EnrollmentService], (service: EnrollmentService) => {
    service.saveApplicant(applicants[0]);
    let person = service.getPersonInfo();
    expect(person).toEqual(applicants[0].person);
  }));
});
