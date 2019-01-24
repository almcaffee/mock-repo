Feature: enrollment instructions #85
As a Applicant, I want to view enrollment instructions before enrolling  

Scenario: Enrollment Instructions Displayed
    Given  Appointment Enrollment API is available  
     When  Applicant enters website
     And  Applicant selects to view enrollment instructions
     Then Enrollment <instructions> are displayed 
     And Client will receive HTTP Status <code> and <msg>
    
Example:
      | instructions                                                                      |  code |    msg                    | 
      | --                                                                                |  --   | --                        |
      | Please enter full name, social security number etc.. Your information is secure.. |  200  | Instructions displayed    |
 
