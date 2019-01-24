Feature: Privacy Validation #67
As a applicant, I want to read and accept my privacy rights, so I know how my personal data will be used as part of the background check process and that my data will be safe.

 Scenario: Privacy accepted and Applicant can proceed
    Given  Applicant Enrollment API is available  
     And   Applicant enters <enrollmentData> on screen
     When  Privacy Data page is displayed
     And   Applicant Accepts Privacy data
     Then  <submit> option will be available for Applicant to submit data
    
    
Example:
      | enrollmentData                                                                    |  submit |
      | --                                                                                | --      | 
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agengy123" | Y       |
 
  Scenario: Privacy Not accepted and Applicant cannot Proceed
    Given  Applicant Enrollment API is available  
     And   Applicant enters <enrollmentData> on screen
     When  Privacy Data page is displayed
     And   Applicant does not Accept Privacy data
     Then  <submit> option will Not be available for Applicant to submit data
 
 Example:      
      | enrollmentData                                                                    |  submit |
      | --                                                                                | --      | 
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agengy123" | N       |  
