Feature: delete enrollment #83
As a Applicant, I want to delete enrollment  

Scenario: Delete Enrollment
    Given  Applicant Enrollment API is available  
     When  Applicant enters <enrollmentData>
     And  Applicant selects to delete enrollment
     Then Enrollment record is deleted 
     And Client will receive HTTP Status <code> and <msg>
    
Example:
      | enrollmentData                                                                    | code | msg                                                | 
      | --                                                                                | --   | --                                                 |
      | name:"Keira Wall",dob:"07161976", email:"kwall@hotmail.com", agencyID:"agengy455" | 200  | Enrollment record for Keira Wall deleted successfully |
