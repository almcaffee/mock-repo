Feature: modify enrollment #84
As a Applicant, I want to modify enrollment record  

Scenario: Modify my Enrollment record
    Given  Applicant Enrollment API is available  
     When  Applicant enters <enrollmentData>
     And  Applicant selects to modify enrollment
     And Applicant saves his modified data 
     Then Enrollment record is modified 
     And Client will receive HTTP Status <code> and <msg>
    
Example:
      | enrollmentData                                                                    | code | msg                                       | 
      | --                                                                                | --   | --                                        |
      | name:"Keira Wall",dob:"07161976", email:"kwall@hotmail.com", agencyID:"agengy455" | 200  | Enrollment record for Keira Wall modified |
