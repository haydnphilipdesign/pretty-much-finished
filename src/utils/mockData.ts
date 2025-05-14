// src/utils/mockData.ts

import { TransactionFormData, AgentRole, MaritalStatus, CommissionType, CommissionBase, TCFeePaidBy, AccessType, PropertyStatus, WarrantyPaidBy, ClientDesignation } from "../components/TransactionForm/types";
import { faker } from '@faker-js/faker';

// Helper function to randomly pick from an array
const randomPick = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Helper function to generate a random currency amount
const randomCurrency = (min: number, max: number): string => 
  faker.number.float({ min, max, precision: 2 }).toFixed(2);

// Helper function to generate a random percentage
const randomPercentage = (min: number, max: number): string => 
  faker.number.float({ min, max, precision: 2 }).toFixed(2);

export const generateMockFormData = (): TransactionFormData => {
  // Generate random role
  const role = randomPick(["listingAgent", "buyersAgent", "dualAgent"]);
  
  // Generate random sale price between 100k and 1M
  const salePrice = randomCurrency(100000, 1000000);
  
  // Generate random commission percentages
  const totalCommission = randomPercentage(2, 6);
  const listingAgentCommission = randomPercentage(1, 3);
  const buyersAgentCommission = randomPercentage(1, 3);
  
  // Generate random fixed amounts
  const totalCommissionFixed = randomCurrency(3000, 30000);
  const listingAgentCommissionFixed = randomCurrency(1500, 15000);
  const buyersAgentCommissionFixed = randomCurrency(1500, 15000);

  return {
    // Role Information
    agentRole: role,
    agentName: faker.person.fullName(),
    agentContact: faker.phone.number(),
    dateSubmitted: faker.date.recent().toISOString(),

    // Property Information
    mlsNumber: faker.string.alphanumeric(8).toUpperCase(),
    propertyAddress: faker.location.streetAddress(true),
    salePrice,
    propertyStatus: randomPick<PropertyStatus>(["Vacant", "Occupied"]),
    townshipName: faker.location.county(),

    // Access Information
    winterizedStatus: randomPick(["Winterized", "De-winterized", "Unknown", "Not Applicable"]),
    accessType: randomPick<AccessType>(["combo_lockbox", "electronic_lockbox", "call_agent", "keypad"]),
    accessCode: faker.string.alphanumeric(6),

    // Client Information
    clients: [
      {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(true),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        maritalStatus: randomPick<MaritalStatus>(["Single", "Married", "Divorce", "Widowed"]),
        designation: randomPick<ClientDesignation>(["Buyer", "Seller"])
      },
      {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(true),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        maritalStatus: randomPick<MaritalStatus>(["Single", "Married", "Divorce", "Widowed"]),
        designation: randomPick<ClientDesignation>(["Buyer", "Seller", ""])
      }
    ],

    // Commission Information
    totalCommission,
    totalCommissionFixed,
    listingAgentCommissionType: randomPick<CommissionType>(["Percentage", "Fixed"]),
    listingAgentCommission,
    listingAgentCommissionFixed,
    buyersAgentCommissionType: randomPick<CommissionType>(["Percentage", "Fixed"]),
    buyersAgentCommission,
    buyersAgentCommissionFixed,
    brokerFee: "0",

    // Referral Information
    referralParty: "",
    brokerEIN: "",
    referralFee: Math.random() > 0.5 ? randomCurrency(500, 5000) : "",

    // Property Details
    resaleCertRequired: faker.datatype.boolean(),
    hoa: Math.random() > 0.5 ? faker.company.name() : "",
    coRequired: faker.datatype.boolean(),
    municipalityTownship: faker.location.county(),
    firstRightOfRefusal: faker.datatype.boolean(),
    firstRightOfRefusalName: Math.random() > 0.5 ? faker.person.fullName() : "",
    attorneyRepresentation: faker.datatype.boolean(),
    attorneyName: Math.random() > 0.5 ? faker.person.fullName() : "",

    // Warranty Information
    homeWarrantyPurchased: faker.datatype.boolean(),
    homeWarrantyCompany: Math.random() > 0.5 ? faker.company.name() : "",
    warrantyCost: Math.random() > 0.5 ? randomCurrency(300, 1000) : "",
    warrantyPaidBy: randomPick<WarrantyPaidBy>(["SELLER", "BUYER", "AGENT"]),

    // Title Company Information
    titleCompany: faker.company.name(),
    tcFeePaidBy: randomPick<TCFeePaidBy>(["CLIENT", "AGENT"]),

    // MLS Status
    updateMLS: faker.datatype.boolean(),

    // Documents
    requiredDocuments: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
      faker.system.fileName()),
    acknowledgeDocuments: faker.datatype.boolean(),

    // Additional Information
    specialInstructions: Math.random() > 0.5 ? faker.lorem.paragraph() : "",
    urgentIssues: Math.random() > 0.5 ? faker.lorem.paragraph() : "",
    additionalNotes: Math.random() > 0.5 ? faker.lorem.paragraph() : "",

    // Final Details
    agentSignature: faker.person.fullName(),
    confirmationChecked: faker.datatype.boolean()
  };
};