export let faq: any = [
  {
    id: "1",
    question: "What is the NEC Applicant Processing System\?",
    answer: "This system is used to gather information about applicants who need background checks\. The NEC Applicant Processing System (NAPS) collects information relating to a paerson's background, and also assists the applicant in sending us biometric data \(such as fingerprints\)\."
  },
  {
    id: "2",
    question: "How do I start\?",
    answer: "If you are applying for the first time, click on the blue new application button on this page\. if you are a returning applicant and want to change information, click on the blue review application button\."
  },
  {
    id: "3",
    question: "What do I need to apply\?",
    answer: "Personal and payment information are necessary to complete the application\. Appropriate identification will be needed when submitting fingerprint to a fingerprint processing location\."
  },
  {
    id: "4",
    question: "How much does an applicant cost\?",
    answer: "Application fees are determind by the requesting agency and are diaplayed durring the enrollment process\. For more information about the fees specific to your application, contact the requesting agency\."
  },
  {
    id: "5",
    question: "How long does it take for my application to be processed\?",
    answer: "The process varies based on the information you provide\. Many factors can change the wait time\. Generally, the process will take less than one month, at most\. Contact your agency for more information\."
  },
  {
    id: "6",
    question: "When will I find out my results\?",
    answer: "After completing your application, you may search for yourself with the NEC applicant search functionality to find status about your enrollment\."
  },
  {
    id: "7",
    question: "Where will I complete my fingerprinting",
    answer: "During the enrollment, the application will display fingerprinting locations\. Fingerprinting locations can also be accessed after enrollment from the applicant dashboard\."
  },
  {
    id: "8",
    question: "What forms of identification do I need to bring with me to the fingerprint location\?",
    answer: "Valid and unexpired picture identification documents are required for fingerprinting\. As a primary form of picture identification one of the following will be accepted at the GAPS Print Locations: Primary Documents include: State Issued Driver's License with Photograph State Issued Identification Card with Photograph US Passport with Photograph US Active Duty/Retiree/Reservist Military ID Card \(000 10-2\) with Photograph Government Issued Employee Identification Card with Photograph \(includes Federal, State, County, City, etc.\) Tribal Identification Card with Photograph However, in the absence of one of the above Primary identifications, applicants may provide one or more of the following Secondary Documents, along with two of the supporting documents listed below: Secondary Documents: State Government Issued Certificate of Birth Social Security Card Certificate of Citizenship (N560) Certificate of Naturalization \(N550\) INS I-551 Resident Alien Card Issued since 1997 NS 1-688 Temporary Resident Identification Card INS I-688B, I-766 Employment Authorization Card Secondary Documentation must be supported by at least two of the following: Utility Bill \(Including street address\) Voter Registration Card Vehicle Registration Card/Title Certificate of Naturalization \(N550\) Current Paycheck Stub with Name and Address Cancelled Check or Bank Statement"
  },
  {
    id: "9",
    question: "Is a separate signed consent form required when submitting fingerprints for employment or licensing purposes\?",
    answer: "The Georgia Crime Information Center \(GCIC\) does not require a separate signed consent form when submitting fingerprints for employment or licensing purposes\. However, an employing/licensing agency may require signed consent from the individual for the agency's own retention and purposes\. GCIC recommends employing/licensing agencies have individuals sign an Acknowledgement Form to ensure they understand that fingerprints are necessary for the purpose of a criminal history record check and the results will help determine suitability for employment or licensing\. Refer to the GAPS Applicant Waiver under Registration on the website's main menu\."
  },
  {
    id: "10",
    question: "Is my information safe\?",
    answer: "NEC Applicant Processing System only shares information with an applicants selected agency and the appropriate fingerprint processing authority\."
  }
];

export let mailingAddress: any = "Applicant Enrollment\nPO BOX 45701\nAtlanta GA 30332\n\n";

export let paymentTypes: any = [
  {
    name: "MAIL_IN",
    message: "Mail In",
    paymentTypes: []
  },
  {
    name: "ELECTRONIC",
    message: "Electronic",
    paymentTypes: [
      {
        name: "ECHECK",
        message: "eCheck"
      },
      {
        name: "CREDIT_CARD",
        message: "Credit Card"
      }
    ]
  }
];

export let privacy: any = "\# Privacy Rights \#\n As an applicant that is the subject of a Georgia only or a Georgia and Federal Bureau of Investigation \(FBI\) national fingerprint/biometric-based criminal history record check for a non-criminal justice purpose \(such as an application for a job or license, immigration or naturalization, security clearance, or adoption\), you have certain rights which are discussed below\.\n - You must be provided written notification that your fingerprints/biometrics will be used to check the criminal history records maintained by the Georgia Crime Information Center \(GCIC\) and the FBI, when a federal record check is so authorized\.\n - If your fingerprints/biometrics are used to conduct a FBI national criminal history check, you are provided a copy of the Privacy Act Statement that would normally appear on the FBI fingerprint card\.\n - If you have a criminal history record, the agency making a determination of your suitability for the job, license, or other benefit must provide you the opportunity to complete or challenge the accuracy of the information in the record\.\n - The agency must advise you of the procedures for changing, correcting, or updating your criminal history record as set forth in Title 28, Code of Federal Regulations \(CFR\), Section 16.34\.\n - If you have a Georgia or FBI criminal history record, you should be afforded a reasonable amount of time to correct or complete the record \(or decline to do so\) before the agency denies you the job, license or other benefit based on information in the criminal history record\.\n - In the event an adverse employment or licensing decision is made, you must be informed of all information pertinent to that decision to include the contents of the record and the effect the record had upon the decision. Failure to provide all such information to the person subject to the adverse decision shall be a misdemeanor [O.C.G.A.§35-3-34\(b\) and §35-3- 35\(b\)]\.\n\n  You have the right to expect the agency receiving the results of the criminal history record check will use it only for authorized purposes and will not retain or disseminate it in violation of state and/or federal statute, regulation or executive order, or rule, procedure or standard established by the National Crime Prevention and Privacy Compact Council\.\n\n \# Privacy Act \#\n Authority: The FBI's acquisition, preservation, and exchange of fingerprints and associated information is generally authorized under 28 U\.S\.\C. 534\. Depending on the nature of your application, supplemental authorities include Federal statutes, State statutes pursuant to Pub\. L\. 92-544, Presidential Executive Orders, and federal regulations\. Providing your fingerprints and associated information is voluntary; however, failure to do so may affect completion or approval of your application\.\n\n Principal Purpose: Certain determinations, such as employment, licensing, and security clearances, may be predicated on fingerprint-based background checks\. Your fingerprints and associated information/biometrics may be provided to the employing, investigating, or otherwise responsible agency, and/or the FBI for the purpose of comparing your fingerprints to other fingerprints in the FBI's Next Generation Identification \(NG\I) system or its successor systems \(including civil, criminal, and latent fingerprint repositories\) or other available records of the employing, investigating, or otherwise responsible agency\. The FBI may retain your fingerprints and associated information/biometrics in NGI after the completion of this application and, while retained, your fingerprints may continue to be compared against other fingerprints submitted to or retained by NGI\.\n\n Routine Uses: During the processing of this application and for as long thereafter as your fingerprints and associated information/biometrics are retained in NGI, your information may be disclosed pursuant to your consent, and may be disclosed without your consent as permitted by the Privacy Act of 1974 and all applicable Routine Uses as may be published at any time in the Federal Register, including the Routine Uses for the NGI system and the FBI's Blanket Routine Uses\. Routine uses include, but are not limited to, disclosures to: employing, governmental or authorized non-governmental agencies responsible for employment, contracting, licensing, security clearances, and other suitability determinations; local, state, tribal, or federal law enforcement agencies; criminal justice agencies; and agencies responsible for national security or public safety\.\n";

export let state: any = {
  stateCode: "GA",
  name: "Georgia"
};

export let states: any = [
  {
    stateCode: "FL",
    name :"Florida"
  },
  {
    stateCode: "GA",
    name: "Georgia"
  }
];

export let agency: any = {
    id: "5b780633d84ced1d98dfb126",
    stateCode: "GA",
    name: "Bart SAFe Agile School",
    alias: "Bart SAFe Agile School | McLean | GA",
    privacyId: "5b78039b4cedfd00010c20d5",
    ori: "GA13236466",
    email: "agency@napstest.com",
    address: {
      address1: "8300 Greensboro Dr",
      address2: "Suite 900",
      city: "McLean",
      state: "GA",
      zip: "99999"
    },
    reasons:[
      {
        agencyServiceLevelId: "5b7c5f73447cb946b063e6b2",
        agencyServiceLevelName: "asl1",
        description: "reason 1 description",
        name: "reason1"
      },
      {
        agencyServiceLevelId: "5b7c5f8a447cb946b063e6b4",
        agencyServiceLevelName: "asl2",
        description: "reason 2 description",
        name: "reason2"
      },
      {
        agencyServiceLevelId: "5ba534774cedfd00015bf3c0",
        agencyServiceLevelName: "New Service Level",
        description: "description3",
        name: "reason3"
      }
    ]
  };

export let agencies: any = [
  {
    id: "5b780633d84ced1d98dfb126",
    stateCode: "GA",
    name: "Bart SAFe Agile School",
    alias: "Bart SAFe Agile School | McLean | GA",
    privacyId: "5b78039b4cedfd00010c20d5",
    ori: "GA13236466",
    email: "agency@napstest.com",
    address: {
      address1: "8300 Greensboro Dr",
      address2: "Suite 900",
      city: "McLean",
      state: "GA",
      zip: "99999"
    },
    reasons:[
      {
        agencyServiceLevelId: "5b7c5f73447cb946b063e6b2",
        agencyServiceLevelName: "asl1",
        description: "reason 1 description",
        name: "reason1"
      },
      {
        agencyServiceLevelId: "5b7c5f8a447cb946b063e6b4",
        agencyServiceLevelName: "asl2",
        description: "reason 2 description",
        name: "reason2"
      }
    ]
  },
  {
    id: "5b780676d84ced1d98dfb128",
    stateCode: "GA",
    name: "Bart SAFe Agile School2",
    alias: "Bart SAFe Agile School2 | McLean | GA",
    privacyId: "5b77fe9c4cedfd00010c20cf",
    ori: "GA13236467",
    email: "agency@napstest.com",
    address: {
      address1: "8300 Greensboro Dr",
      address2: "Suite 900",
      city: "McLean",
      state:"GA",
      zip:"99999"
    },
    reasons: [
      {
        agencyServiceLevelId: "5b7c5f73447cb946b063e6b2",
        agencyServiceLevelName: "asl1",
        description: "reason 1 description",
        name: "reason1"
      },
      {
        agencyServiceLevelId: "5b7c5f8a447cb946b063e6b4",
        agencyServiceLevelName: "asl2",
        description: "reason 2 description",
        name: "reason2"
      },
      {
        agencyServiceLevelId: "5ba534774cedfd00015bf3c0",
        agencyServiceLevelName: "New Service Level",
        description: "description3",
        name: "reason3"
      }
    ]
  }
];

export let agencyServiceLevels: any = [
  {
    id: '5b7c5f73447cb946b063e6b2',
    name: 'reason1',
    stateCode: 'GA',
    serviceLevel: "State Check Only",
    electronicFee: 36.25,
    paperFee: 44.25,
    agencyElectronicFeePercent: 50,
    agencyPaperFeePercent: 50
  },
  {
    id: '5b7c5f8a447cb946b063e6b4',
    name: 'reason2',
    stateCode: 'GA',
    serviceLevel: "State and National Check",
    electronicFee: 54.95,
    paperFee: 89.95,
    agencyElectronicFeePercent: 67.5,
    agencyPaperFeePercent: 67.5
  },
  {
    id: '5ba534774cedfd00015bf3c0',
    name: 'reason3',
    stateCode: 'GA',
    serviceLevel: "State and Local Check",
    electronicFee: 49.95,
    paperFee: 69.95,
    agencyElectronicFeePercent: 100,
    agencyPaperFeePercent: 100
  }
];

export let applicantModel: any = {
  id: null,
  stateCode: null,
  status: null,
  confirmation: null,
  qrCode: null,
  fingerPrintCardUser: null,
  transaction: {
    reviewingAgency: null,
    reviewingAgencyId: null,
    requestingAgencyId: null,
    reason: null,
    appliedPosition: null,
  },
  person: {
    lastName: null,
    firstName: null,
    middleName: null,
    suffix: null,
    ssn: null,
    dateOfBirth: null,
    placeOfBirth: null,
    countryOfCitizenship: null,
    gender: null,
    race: null,
    height: null,
    weight: null,
    eyeColor: null,
    hairColor: null,
    phone: null,
    email: null,
    driversLicenseNumber: null,
    stateDriversLicense: null
  },
  address: {
    address1: null,
    address2: null,
    suite: null,
    city: null,
    state: null,
    zip: null
  },
  payment: {
    amount: null,
    eCheck: null,
    hashCC: null,
    paymentMethod: null,
    paymentType: null,
    verifyTransaction: null,
    creditCard: {
      cardType: null,
      cardHolder: null,
      cardNumber: null,
      cvv: null,
      expirationDate: null
    },
    billingAddress: {
      address1: null,
      address2: null,
      city: null,
      suite: null,
      state: null,
      zip: null
    }
  }
};

export let applicant: any = {
  id: null,
  stateCode: agency.stateCode,
  status: null,
  confirmation: null,
  qrCode: null,
  transaction: {
    reviewingAgency: agencies[0].name,
    reviewingAgencyId: agencies[0].id,
    reviewingAgencyServiceLevel: agencyServiceLevels[0],
    requestingAgencyId: null,
    reason: agencies[0].reasons[0],
    appliedPosition: agencies[0].reasons[0].name
  },
  person: {
    lastName: "Doe",
    firstName: "John",
    middleName: null,
    suffix: null,
    ssn: null,
    dateOfBirth: "10011978",
    placeOfBirth: "GA",
    countryOfCitizenship: "US",
    gender: "M",
    race: "U",
    height: "602",
    weight: "185",
    eyeColor: "BLK",
    hairColor: "BRO",
    phone: "2603359855",
    email: 'doe.john@test.com',
    driversLicenseNumber: null,
    stateDriversLicense: null
  },
  address: {
    address1: "12345 Any Street",
    address2: null,
    suite: null,
    city: "Gainsville",
    state: "GA",
    zip: "12345"
  },
  payment: {
    amount: agencyServiceLevels[0].electronicFee,
    eCheck: null,
    hashCC: null,
    paymentMethod: 'ELECTRONIC',
    paymentType: 'CREDIT_CARD',
    verifyTransaction: null,
    creditCard: {
      cardType: "Visa",
      cardHolder: "Test Applicant",
      cardNumber: "5148875063870734",
      cvv: "234",
      expirationDate: "0720"
    },
    billingAddress: {
      address1: "12345 Any Street",
      address2: null,
      city: "Gainsville",
      suite: null,
      state: "GA",
      zip: "00000"
    }
  }
};

export let applicantNoPayment: any = {
  id: null,
  stateCode: agency.stateCode,
  status: null,
  confirmation: null,
  qrCode: null,
  transaction: {
    reviewingAgency: agencies[0].name,
    reviewingAgencyId: agencies[0].id,
    requestingAgencyId: null,
    reviewingAgencyServiceLevel: agencyServiceLevels[0],
    reason: agencies[0].reasons[0],
    appliedPosition: agencies[0].reasons[0].name
  },
  person: {
    lastName: "Doe",
    firstName: "John",
    middleName: null,
    suffix: null,
    ssn: null,
    dateOfBirth: "10011978",
    placeOfBirth: "GA",
    countryOfCitizenship: "US",
    gender: "M",
    race: "U",
    height: "602",
    weight: "185",
    eyeColor: "BLK",
    hairColor: "BRO",
    phone: "2603359855",
    email: 'doe.john@test.com',
    driversLicenseNumber: null,
    stateDriversLicense: null
  },
  address: {
    address1: "12345 Any Street",
    address2: null,
    suite: null,
    city: "Gainsville",
    state: "GA",
    zip: "12345"
  }
};

export let applicants: any = [{
  id: "5b3e5fa146e0fb00018f72c2",
  stateCode: states[1].stateCode,
  status: "REGISTERED",
  confirmation: "UCBHFQW6D7J5",
  qrCode: "iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9AQAAAACn+1GIAAAA80lEQVR42u3VMQ7DIAwFUEsM2coFKnENb5ypF0jgAnAltlwDiQswMkS4ztI2E2ZrpVoZojcQ88EK0LUa/OFrwYGKZAKAFkOkEpPqll+kEKD4VjqqKXCYb5NQ0YQZ4E6dpWvrA+A8ApZrQAPg6kvWl2MYgG+qY9721xpjoGaITGyKxNCxVAtcmxgoHY9GPuUZgG03dTnk4PAAPqVmohg6cOR5xffmhkD7HRZeKWsxeFIVi4MJOJu1Z+pRDHyDiOCGn2M6gHPmGj+v1MdwzlwyDgrNAF+6Fe56BioYt3x+dgDcqU8ULMiB83A2rzZrMfx/BT8ATwW0YFzRNL3GAAAAAElFTkSuQmCC",
  transaction: {
    reviewingAgency: agencies[0].name,
    reviewingAgencyId: agencies[0].id,
    reviewingAgencyServiceLevel: agencyServiceLevels[0],
    requestingAgencyId: null,
    reason: agencies[0].reasons[0],
    appliedPosition: agencies[0].reasons[0].name
  },
  person: {
    lastName: "Doe",
    firstName: "John",
    middleName: null,
    suffix: null,
    ssn: null,
    dateOfBirth: "10011978",
    placeOfBirth: "GA",
    countryOfCitizenship: "US",
    gender: "M",
    race: "U",
    height: "602",
    weight: "185",
    eyeColor: "BLK",
    hairColor: "BRO",
    phone: "2603359855",
    email: 'doe.john@test.com',
    driversLicenseNumber: null,
    stateDriversLicense: null
  },
  address: {
    address1: "12345 Any Street",
    address2: null,
    suite: null,
    city: "Gainsville",
    state: "GA",
    zip: "12345"
  },
  payment: {
    amount: 'agencyServiceLevels[0].electronicFee',
    eCheck: null,
    hashCC: null,
    paymentMethod: 'ELECTRONIC',
    paymentType: 'CREDIT_CARD',
    verifyTransaction: null,
    creditCard: {
      cardType: "Visa",
      cardHolder: "Test Applicant",
      cardNumber: "5148875063870734",
      cvv: "234",
      expirationDate: "0720"
    },
    billingAddress: {
      address1: "12345 Any Street",
      address2: null,
      city: "Gainsville",
      suite: null,
      state: "GA",
      zip: "00000"
    }
  }
},
{
  id: "6y7n5fa1fr67lb00018fr56m",
  stateCode: states[1].stateCode,
  status: "REGISTERED",
  confirmation: "HJ8NTGW6D67U",
  qrCode: "iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9AQAAAACn+1GIAAAA80lEQVR42u3VMQ7DIAwFUEsM2coFKnENb5ypF0jgAnAltlwDiQswMkS4ztI2E2ZrpVoZojcQ88EK0LUa/OFrwYGKZAKAFkOkEpPqll+kEKD4VjqqKXCYb5NQ0YQZ4E6dpWvrA+A8ApZrQAPg6kvWl2MYgG+qY9721xpjoGaITGyKxNCxVAtcmxgoHY9GPuUZgG03dTnk4PAAPqVmohg6cOR5xffmhkD7HRZeKWsxeFIVi4MJOJu1Z+pRDHyDiOCGn2M6gHPmGj+v1MdwzlwyDgrNAF+6Fe56BioYt3x+dgDcqU8ULMiB83A2rzZrMfx/BT8ATwW0YFzRNL3GAAAAAElFTkSuQmCC",
  transaction: {
    reviewingAgency: agencies[1],
    reviewingAgencyId: agencies[1].id,
    reviewingAgencyServiceLevel: agencyServiceLevels[1],
    requestingAgencyId: null,
    reason: agencies[0].reasons[1],
    appliedPosition: agencies[0].reasons[1].name
  },
  person: {
    lastName: "Gordon",
    firstName: "Karen",
    middleName: "Sheree",
    suffix: null,
    ssn: null,
    dateOfBirth: "07141981",
    placeOfBirth: "GA",
    countryOfCitizenship: "US",
    gender: "F",
    race: "U",
    height: "508",
    weight: "140",
    eyeColor: "BLK",
    hairColor: "BRO",
    phone: "2603359855",
    email: 'gordon.karen@test.com',
    driversLicenseNumber: null,
    stateDriversLicense: null
  },
  address: {
    address1: "12345 Any Street",
    address2: "Apt. A",
    suite: null,
    city: "Savannah",
    state: "GA",
    zip: "11111"
  },
  payment: {
    amount: 'agencyServiceLevels[0].paperFee',
    eCheck: null,
    hashCC: null,
    paymentMethod: 'MAIL_IN',
    paymentType: null,
    verifyTransaction: null,
    creditCard: {
      cardType: null,
      cardHolder: null,
      cardNumber: null,
      cvv: null,
      expirationDate: null
    },
    billingAddress: {
      address1: null,
      address2: null,
      city: null,
      suite: null,
      state: null,
      zip: null
    }
  }
}];

export let testSearch: any = {
  stateCode: applicants[0].stateCode,
  lastName: applicants[0].person.lastName,
  firstName: applicants[0].person.firstName,
  confirmation: applicants[0].confirmation,
  gCaptchaResponse: 'XX5XXX5X'
};

export let badTestSearch: any = {
  stateCode: applicants[0].stateCode,
  lastName: applicants[0].person.lastName,
  firstName: applicants[0].person.firstName,
  confirmation: applicants[0].confirmation,
  gCaptchaResponse: 'XX5XXX5X'
};

export let searchResult: any = applicant;

export let steps: any[] = [
  { active: false, editable: false, interacted: false, label: 'Privacy', completed: false, route: '/privacy', canAutoComplete: true },
  { active: false, editable: false, interacted: false, label: 'Applicant Information', completed: false, route: '/applicant-information', canAutoComplete: true },
  { active: false, editable: false, interacted: false, label: 'Site Location', completed: false, route: '/site-location', canAutoComplete: true },
  { active: false, editable: false, interacted: false, label: 'Payment Information', completed: false, route: '/payment-information', canAutoComplete: true },
  { active: false, editable: false, interacted: false, label: 'Confirm Enrollment', completed: false, route: '/confirm-enrollment', canAutoComplete: true }
];

export let siteLocations = [ { id:"uuid1", region:"1", company:"Cartersville Drug and Alcohol Testing", city:"Cartersville", state:"GA", county:"Bartow", mobile:"true", ahca:"false", phone:"267-887-4320", hours:"10:00 AM - 4:30 PM" }, { id:"uuid2", region:"1", company:"Noblitt, Goss & Associates Insurance Services", city:"Fort Oglethorpe",	state:"GA", county:"Walker", mobile:"false", ahca:"false", phone:"215-434-8888", hours:"9:00 AM - 5 PM" }, { id:"uuid3", region:"1", company:"The UPS Store 4805", city:"East Ellijay", state:"GA", county:"Gilmer", mobile:"false", ahca:"false", phone:"215-434-8888", hours:"9:00 AM - 5 PM" } ];
