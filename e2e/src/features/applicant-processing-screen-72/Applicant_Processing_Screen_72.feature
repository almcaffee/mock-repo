Feature: Applicant Processing Screen #72
As a applicant, I want to view an applicant processing screen, so that I can manage the background check process

Scenario: Display Applicant Search on the selection
    Given  Applicant Search link is available online  
     When  Applicant enters <searchData> 
     Then  Search results are returned
     And   Client will receive HTTP Status <code>
     And   <msg> will be displayed.

Example:
      | searchData                                                                        |  code |  msg                                         |
      | --                                                                                | --    |  --                                          | 
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agengy123" | 200   | Applicant John Smith Found - Address xyz     |
      | name:"Keira Wall",dob:"07161976", email:"kwall@hotmail.com", agencyID:"agengy455" | 400   | Applicant Keira Wall not found               |
      
Scenario: Display Applicant Overview on the selection
    Given  Applicant Search link is available online  
     When  Applicant enters <searchData> 
     Then  <Overviewdetails> are returned
     And   Client will receive HTTP Status <code>
     And   <Overviewdetails> will be displayed.

Example:
      | searchData                                                                        |  code |  Overviewdetails                                                                     |
      | --                                                                                | --    |  --                                                                      | 
      | name:"John Smith",dob:"05151970", email:"smith@hotmail.com", agencyID:"agengy123" | 200   | Applicant John Smith Found - Address xyz, SSN: 123-45-6789, DOB 05151970 |
      | name:"Kim Josh",dob:"08161983", email:"kjosh@hotmail.com", agencyID:"agengy144" | 200   | Applicant Kim Josh Found - Address xyz, SSN: 111-22-7777, DOB 08161983     |
      
Scenario: Display FAQ Viewable
    Given  Applicant Overview API is available   
     When  Applicant selects FAQ button 
     Then  FAQ Details are displaed
     And   Client will receive HTTP Status <code> and <msg>.

Example:
      |   code |  msg                                  |
      |  --    |  --                                   | 
      | 200   | FAQ Details displayed successfully     |
      
Scenario: New Enrollment Initiated
    Given  Applicant enrollment API is available  
     When  Applicant selects Enroll option 
     Then  Enrollment Screen is displayed
     And   Applicant is provided with option to enter data
     And   Client will receive HTTP Status <code>
     And   <msg> will be displayed.

Example:
      |   code |  msg                                 |
      |  --    |  --                                  | 
      | 200   | Enrollment Initiated successfully     |