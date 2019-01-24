Feature: Applicant Payment (Credit) #78
As a Applicant, I want to see the cost breakdown for my background check and be able to pay for my background check with my credit card, so I don’t need to pay at the print site location

Scenario: Check Amount Due
    Given  Applicant Payment API is available  
     When  Applicant <confirmation> Number is submitted
     And Agency is selected
     And Amount due is requested
     Then <AmountDue> is displayed 
     And Client will receive HTTP Status <code>
     And <msg> will be displayed.
    
Example:
      | confirmation                 | AmountDue |  code |    msg                                               | 
      | --                           | --        |  --   | --                                                   |
      | Confirmation Number:"AK86B54"| 75.00 USD |  200  | agencyID:"agency675" Chantilly Fingerprinting Center |
      

Scenario: Payment made using Credit Card
    Given  Applicant Payment API is available  
     When  Applicant <confirmation> Number is submitted
     And  Credit Card details are submitted
     Then <AmountDue> is posted 
     And Client will receive HTTP Status <code>
     And <msg> will be displayed.
    
Example:
      | confirmation                 | AmountDue |  code |    msg                                                      | 
      | --                           | --        |  --   | --                                                          |
      | Confirmation Number:"RG51H54"| 75.00 USD |  200  | Payment received successfully with Credit Card ending **4432|
      | Confirmation Number:"KF42Y22"| 75.00 USD |  402  | Payment failed - Invalid Credit Card ending **4219          |
      | Confirmation Number:"BV34J61"| 75.00 USD |  403  | Payment failed - Credit Card Billing details failure        |
            
 
