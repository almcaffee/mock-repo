Feature: print confirmation receipt #90
As a Applicant, I want to print my enrollment confirmation receipt

Scenario: Print my Enrollment confirmation receipt
    Given  Applicant Overview API is available   
     When  Applicant selects print confirmation button
     Then  Confirmation Details are displayed
     And confirmation receipt is printed in the local printer
     And   Client will receive HTTP Status <code> and <msg>.

Example:
      | code  | msg                                  |
      | --    | --                                   | 
      | 200   | Confirmation receipt printed successfully     |
    
