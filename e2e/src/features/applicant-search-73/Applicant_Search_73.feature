Feature: Applicant Search #73
As a Applicant, I want an easy to navigate single page that allows me to search for my existing enrollment. 

Scenario: Existing Applicant Search with Captcha Validation
    Given  Applicant search API is available  
     When  Applicant enters <enrollmentData> 
     And Applicant enters Captcha Data
     And   Search is selected
     Then  results are displayed 
     And Client will receive HTTP Status <code> and <msg>.
    
Example:
      | enrollmentData                                                                    |   code |    msg                    | 
      | --                                                                                |   --   | --                        |
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agency512" |   200  | Applicant Enrolled   |
      | name:"Ashlee John",dob:"03251979", email:"ajohn@gmail.com", agencyID:"agency514"  |   403  | Captcha Entry failed. Please enter the correct value               |
      | name:"Sam Perry",dob:"09071975", email:"sperry@gmail.com", agencyID:"agency675"   |   400  | Applicant currently Not enrolled  |
      
 Scenario: View FAQ
    Given  Applicant search API is available  
     When  Applicant Enrollment page is displayed
      And  FAQ is selected
     Then  FAQ Page is displayed
      And  Client will receive HTTP Status <code> 
      And  <msg> will be displayed.
    
 Example:
      | enrollmentData                                                                    |  code |    msg            | 
      | --                                                                                |  --   | --                |
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agency776" | 200   | FAQ is displayed  |
     

