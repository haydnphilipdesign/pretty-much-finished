ROLE VISIBILITY KEY: (L=Listing Agent, B=Buyer's Agent, D=Dual Agent, A=All Roles)

1. Role Section:

Role Selection (fldOVyoxz38rWwAFy): singleSelect [BUYERS AGENT, LISTING AGENT, DUAL AGENT], Required: Yes, Visibility: [A]

2. Property Section:

MLS Number (fld6O2FgIXQU5G27o): singleLineText, Required: Yes, Visibility: [L/D]
Property Address (fldypnfnHhplWYcCW): singleLineText, Required: Yes, Visibility: [A]
Sale Price (fldhHjBZJISmnP8SK): currency, Required: Yes, Visibility: [A]
Property Status (fldV2eLxz6w0TpLFU): singleSelect [OCCUPIED, VACANT], Required: Yes, Visibility: [L/D]
Winterized Status (fldExdgBDgdB1i9jy): singleSelect [WINTERIZED, NOT WINTERIZED], Required if Property Status = VACANT, Visibility: [L/D]
Update MLS Status (fldw3GlfvKtyNfIAW): singleSelect [YES, NO], Required: Yes, Visibility: [L/D]
Property Access Type (fld7TTQpaC83ehY7H): singleSelect [ELECTRONIC LOCKBOX, COMBO LOCKBOX, KEYPAD, APPOINTMENT ONLY], Required: Yes, Visibility: [L/D]
Lockbox Access Code (fldrh8eB5V8TjSZlR): singleLineText, Required if Property Access Type = ELECTRONIC LOCKBOX, COMBO LOCKBOX, KEYPAD, Visibility: [L/D]
County: singleLineText, Required: Yes, Visibility: [A]
Property Type: singleSelect [RESIDENTIAL, COMMERCIAL, LAND], Required: Yes, Visibility: [A]
Built Before 1978: singleSelect [YES, NO], Required: Yes, Visibility: [A]
Closing Date: date, Required: Yes, Visibility: [A]

3. Client Section:

Client Name (fldSqxNOZ9B5PgSab): singleLineText, Required: Yes, Visibility: [A]
Client Email (flddP6a8EG6qTJdIi): email, Required: Yes, Visibility: [A]
Client Phone (fldBnh8W6iGW014yY): phoneNumber, Required: Yes, Visibility: [A]
Client Address (fldz1IpeR1256LhuC): singleLineText, Required: Yes, Visibility: [A]
Marital Status (fldeK6mjSfxELU0MD): singleSelect [SINGLE, MARRIED, DIVORCED, DIVORCE IN PROGRESS, WIDOWED], Required: Yes, Visibility: [A]
Client Designation (fldSY6vbE1zAhJZqd): singleSelect [BUYER, SELLER], Required: Yes, Visibility: [D]

Client requirement: [L/B] at least 1 client required, [D] at least 2 clients required

4. Commission Section:

Total Commission % (fldE8INzEorBtx2uN): number, Required: Yes, Visibility: [L/D]
Listing Agent Commission % (flduuQQT7o6XAGlRe): number, Required: Yes, Visibility: [L/D]
Buyers Agent Commission % (fld5KRrToAAt5kOLd): number, Required: Yes, Visibility: [A]
Has Broker Fee: switch [YES, NO], Required: Yes, Visibility: [A]
Broker Fee Amount (flddRltdGj05Clzpa): currency, Required if Has Broker Fee = YES, Visibility: [A]
Has Seller's Assist: switch [YES, NO], Required: Yes, Visibility: [A]
Seller's Assist Amount (fldTvXx96Na0zRh6W): currency, Required if Has Seller's Assist = YES, Visibility: [A]
Is Referral: switch [YES, NO], Required: Yes, Visibility: [A]
Referral Party (fldzVtmn8uylVxuTF): singleLineText, Required if Is Referral = YES, Visibility: [A]
Broker EIN (fld20VbKbWzdR4Sp7): singleLineText, Required if Is Referral = YES, Visibility: [A]
Referral Fee % (fldewmjoaJVwiMF46): number, Required if Is Referral = YES, Visibility: [A]
Coordinator Fee Paid By: singleSelect [client, agent], Required: Yes, Visibility: [A]

5. Property Details Section:

Resale Certificate Required: switch [YES, NO], Required: Yes, Visibility: [A]
HOA Name (fld9oG6SMAkh4hvNL): singleLineText, Required if Resale Certificate Required = YES, Visibility: [A]
CO Required: switch [YES, NO], Required: Yes, Visibility: [A]
Municipality/Township (fld9Qw4mGeI9kk42F): singleLineText, Required if CO Required = YES, Visibility: [A]
First Right of Refusal: switch [YES, NO], Required: Yes, Visibility: [L/D]
First Right of Refusal Name (fldeHKiUreeDs5n4o): singleLineText, Required if First Right of Refusal = YES, Visibility: [L/D]
Attorney Representation: switch [YES, NO], Required: Yes, Visibility: [A]
Attorney Name (fld4YZ0qKHvRLK4Xg): singleLineText, Required if Attorney Representation = YES, Visibility: [A]
Home Warranty Purchased: switch [YES, NO], Required: Yes, Visibility: [A]
Warranty Company (fldRtNEH89tNNX52B): singleLineText, Required if Home Warranty Purchased = YES, Visibility: [A]
Warranty Cost (fldxH1pCpohty1e2b): currency, Required if Home Warranty Purchased = YES, Visibility: [A]
Warranty Paid By (fld61RStU7sCDrG01): singleSelect [SELLER, BUYER, AGENT], Required if Home Warranty Purchased = YES, Visibility: [A]
Title Company Name (fldqeArDeRkxiYz9u): singleLineText, Required: Yes, Visibility: [B/D]

6. Documents Section:

Listing Agent Required Documents [L]
Buyer's Agent Required Documents [B]
Dual Agent Required Documents [D]
Document Confirmation: checkbox, Required: Yes, Visibility: [A]

7. Additional Info Section:

Special Instructions (fldDWN8jU4kdCffzu): richText, Required: No, Visibility: [A]
Urgent Issues (fldgW16aPdFMdspO6): richText, Required: No, Visibility: [A]
Additional Notes (fld30htJ7euVerCLW): richText, Required: No, Visibility: [A]

8. Signature Section:

Digital Signature (fldFD4xHD0vxnSOHJ): singleLineText, Required: Yes, Visibility: [A]
Confirm Accuracy: checkbox, Required: Yes, Visibility: [A]
