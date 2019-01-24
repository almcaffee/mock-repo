Feature: Applicant Status Screen #75
Applicant Status screen is a easy to navigate single page that allows applicants to search for existing enrollments, and obtain information about the Applicant Processing process

 Scenario: Current Status Displayed
    Given  Check Status API is available  
     When  Applicant <enrollmentData> is received
     Then  Applicant Status page is displayed
     And   Applicant will receive HTTP Status <code>
     And   Confirmation <num> will be displayed
     And   QR code <qrc> will be displayed
     And   <msg> will be displayed indicating Applicant Status.
    
Example:
      | enrollmentData                                                                    |  code | num   |  qrc  |  msg                   |
      | --                                                                                | --    | --    | --    |                        | 
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agengy123" | 200   | 12345 | A7C37 | Applicant Approved     |
      | name:"Steve Koch", dob:"01231983", email:"skoch@gmail.com", agencyID:"agency123"  | 202   | 33421 | CX783 | Application in Process |
      | name:"William hall", dob:"01231981", email:"whall@gmail.com", agencyID:"agency123"| 402   | 41217 | S6TT4 | Applicant Not Approved |
      