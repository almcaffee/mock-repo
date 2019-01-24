Feature: enrollment confirmation Screen #78
As a applicant, I want to view my enrollment confirmation, so that I can use confirmation details for background check fingerprinting and status checks

Scenario: Applicant verifies enrollment data
    Given  Enrollment API is available 
     When  Applicant enters <enrollmentData> 
     And   Applicant enters captcha data
     And   Submit button is selected
     Then  enrollment confirmation data is displayed
     And   Client will receive HTTP Status <code> with <msg>

Example:
      | enrollmentData                                                                    |  code |  msg                                         |
      | --                                                                                | --    |  --                                          | 
      | name:"Jade james",dob:"02111972", email:"jjames@gmail.com", agencyID:"agengy123"  | 200   | Applicant Jade James enrolled successfully   |
      | name:"Keira Wall",dob:"07161976", email:"kwall@hotmail.com", agencyID:"agengy455" | 400   | Error in Captcha                             |
      | name:"John Trello",dob:"08191975", email:"jtrello@gmail.com", agencyID:"agengy455" | 400   | Invalid date of birth entered               |
      | name:"Keira Wall",dob:"07161976", email:"kwall@hotmail.com", agencyID:"agengy455" | 400   | Invalid social security number entered       |
      
