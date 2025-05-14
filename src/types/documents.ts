export interface DocumentData {
  // Common Documents
  documentConfirmation: boolean;

  // Listing Agent Documents
  agreementOfSaleAndAddenda: boolean;
  buyerPrequalification: boolean;
  kwAffiliateServicesAddendum: boolean;
  sellersPropertyDisclosure: boolean;
  sellersEstimatedCosts: boolean;
  kwWireFraudAdvisory: boolean;
  cooperatingBrokersCompensation: boolean;
  referralAgreementAndW9: boolean;
  attorneyReviewClause: boolean;
  leadBasedPaintDisclosure: boolean;
  kwHomeWarrantyWaiver: boolean;
  dualAgencyDisclosure: boolean;

  // Buyer's Agent Additional Documents
  kwAffiliateServicesDisclosure: boolean;
  consumerNotice: boolean;
  buyersAgencyContract: boolean;
  depositMoneyNotice: boolean;
  buyersEstimatedCosts: boolean;
  kpssAba: boolean;
  forYourProtectionNotice: boolean;
}

export interface RequiredDocuments {
  // Common Documents
  documentConfirmation: true;

  // Listing Agent Required Documents
  listingAgent: {
    required: {
      agreementOfSaleAndAddenda: true;
      buyerPrequalification: true;
      kwAffiliateServicesAddendum: true;
      sellersPropertyDisclosure: true;
      sellersEstimatedCosts: true;
      kwWireFraudAdvisory: true;
      cooperatingBrokersCompensation: true;
      referralAgreementAndW9: true;
    };
    optional: {
      attorneyReviewClause: boolean;
      leadBasedPaintDisclosure: boolean;
      kwHomeWarrantyWaiver: boolean;
      dualAgencyDisclosure: boolean;
    };
  };

  // Buyer's Agent Required Documents
  buyersAgent: {
    required: {
      agreementOfSaleAndAddenda: true;
      kwAffiliateServicesDisclosure: true;
      kwAffiliateServicesAddendum: true;
      kwWireFraudAdvisory: true;
      kwHomeWarrantyWaiver: true;
      consumerNotice: true;
      buyersAgencyContract: true;
      buyerPrequalification: true;
      sellersPropertyDisclosure: true;
      depositMoneyNotice: true;
      buyersEstimatedCosts: true;
      cooperatingBrokersCompensation: true;
    };
    optional: {
      attorneyReviewClause: boolean;
      kpssAba: boolean;
      leadBasedPaintDisclosure: boolean;
      forYourProtectionNotice: boolean;
      referralAgreementAndW9: boolean;
      dualAgencyDisclosure: boolean;
    };
  };

  // Dual Agent Required Documents
  dualAgent: {
    required: {
      agreementOfSaleAndAddenda: true;
      kwAffiliateServicesDisclosure: true;
      kwAffiliateServicesAddendum: true;
      consumerNotice: true;
      buyersAgencyContract: true;
      buyerPrequalification: true;
      sellersPropertyDisclosure: true;
      depositMoneyNotice: true;
      buyersEstimatedCosts: true;
      sellersEstimatedCosts: true;
      kwWireFraudAdvisory: true;
      dualAgencyDisclosure: true;
    };
    optional: {
      kwHomeWarrantyWaiver: boolean;
      leadBasedPaintDisclosure: boolean;
      attorneyReviewClause: boolean;
      kpssAba: boolean;
      forYourProtectionNotice: boolean;
      referralAgreementAndW9: boolean;
    };
  };
}
