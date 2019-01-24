Feature: Applicant Scheduling (Print Site) #68
As a Applicant, I want to view Print Site location details, so that I can confirm there is a location near me, where I can get fingerprinted  

Scenario: Appointment Type Selected
    Given  Appointment Scheduling API is available  
     When  Applicant <enrollmentData> is received
     And Appointment type is selected
     And Location details are entered
     Then Available Scheduling <sites> are listed 
     And Client will receive HTTP Status <code>
     And <msg> will be displayed.
    
Example:
      | enrollmentData                                                                    | sites      |  code |    msg                    | 
      | --                                                                                | --         |  --   | --                        |
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agency512" | Centerville|  200  | Fingerprint Center open from 9:00Am to 5:00PM   |
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agency514" | Herndon    |  200  | Fingerprint Center open from 9:30AM to 4:30PM  |
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agency675" | Chantilly  |  200  | Fingerprint Center open from 9:00AM to 3:00PM  |
      
 Scenario: Appointment Cancelled if Site not available
    Given  Appointment Scheduling API is available  
     When  Applicant <enrollmentData> is received
       And Appointment type is selected
       And Location details are entered
     Then  Available Scheduling <sites> are Not available 
       And Appointment Cancel button is selected 
       Then Client will receive HTTP Status <code>
       And <msg> will be displayed.
    
 Example:
      | enrollmentData                                                                    | sites        |  code |    msg                | 
      | --                                                                                | --           |  --   | --                    |
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agency776" | Not available| 402   | Enrollment Cancelled  |
     

