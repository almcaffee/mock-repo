Feature: New Applicant Enrollment #65
As a applicant, I want to create a new applicant enrollment, so that I can initiate a background check within my state.

Scenario: Initiate Background Check
    Given  Applicant Enrollment link is available online  
     When  Applicant enters personal information
     Then  option to initiate background check is displayed
     And   Applicant submits <enrollmentData>
     And   Client will receive HTTP Status <code>
     And   <msg> will be displayed.

Example:
      | enrollmentData                                                                    |  code |  msg                                     |
      | --                                                                                | --    |  --                                      | 
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agengy123" | 200   | Applicant Background Check Initiated     |

      