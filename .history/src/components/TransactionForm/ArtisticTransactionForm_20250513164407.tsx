import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AgentRole, Client } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';

// Import components
import { RoleSelection } from "@/components/TransactionForm/RoleSelection";
import { PropertyInformation } from "@/components/TransactionForm/PropertyInformation";
import { ClientInformation } from "@/components/TransactionForm/ClientInformation";
import { ArtisticClientSection } from "@/components/TransactionForm/ArtisticClientSection";
import { ArtisticStepWizard } from "@/components/TransactionForm/ArtisticStepWizard";
import { CommissionSection } from "@/components/TransactionForm/CommissionSection";
import { DocumentsSection } from "@/components/TransactionForm/DocumentsSection";
import { PropertyDetailsSection } from "@/components/TransactionForm/PropertyDetailsSection";
import { AdditionalInfoSection } from "@/components/TransactionForm/AdditionalInfoSection";
import { SignatureSection } from "@/components/TransactionForm/SignatureSection";
import { ReviewSection } from "@/components/TransactionForm/ReviewSection";
import { SubmissionProgress } from "@/components/TransactionForm/SubmissionProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Home, Star, Users, DollarSign, FileText, Info, PenTool, CheckCircle, UserPlus } from "lucide-react";

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useToast } from "@/hooks/use-toast";

// Import styles
import "./ArtisticForm.css";
import './TransactionFormFix.css'; // Import fix for transparent form fields

// Add import for ValidationBypassButtons
import { ValidationBypassButtons } from './ValidationBypassButtons';

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Array of artistic backgrounds that will rotate
const artBackgrounds = [
  "linear-gradient(135deg, #396afc, #2948ff)",
  "linear-gradient(135deg, #654ea3, #eaafc8)",
  "linear-gradient(135deg, #2c3e50, #4ca1af)",
  "linear-gradient(135deg, #11998e, #38ef7d)",
  "linear-gradient(135deg, #36474f, #546e7a)",
  "linear-gradient(135deg, #3f4866, #667292)",
  "linear-gradient(135deg, #003973, #e5e5be)",
  "linear-gradient(135deg, #355c7d, #6c5b7b, #c06c84)",
];

// Icons for each step
const stepIcons = [
  <Home size={18} />,
  <Star size={18} />,
  <Users size={18} />,
  <DollarSign size={18} />,
  <Home size={18} />,
  <FileText size={18} />,
  <Info size={18} />,
  <CheckCircle size={18} />,
];

export function ArtisticTransactionForm() {
  const { toast } = useToast();
  const {
    currentStep,
    setCurrentStep,
    agentData,
    setAgentData,
    propertyData,
    setPropertyData,
    clients,
    setClients,
    commissionData,
    setCommissionData,
    propertyDetails,
    setPropertyDetails,
    titleData,
    setTitleData,
    additionalInfo,
    setAdditionalInfo,
    signatureData,
    setSignatureData,
    documentsData,
    setDocumentsData,
    handleStepClick,
    handleNext,
    handlePrevious,
    handleSubmit: submitTransaction,
    submitting,
    showProgressOverlay,
    submissionSteps,
    currentSubmissionStep,
    submissionError,
    closeProgressOverlay,
    skippedFields,
    getAllSkippedFields,
    isFieldSkipped,
    showValidationUI,
    validationErrors,
    handleContinueWithErrors,
    handleFixValidationError,
    closeValidationUI
  } = useTransactionForm();

  // State for artistic elements
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [scrolledSections, setScrolledSections] = useState<number[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get the selectedRole from agentData
  const selectedRole: AgentRole | undefined = agentData?.role || undefined;

  // Function to navigate to step with missing field
  const handleFixField = (field: string) => {
    // Map field names to their corresponding steps
    const fieldToStepMapping: Record<string, number> = {
      // Agent fields - Step 1
      'role': 1,

      // Property fields - Step 2
      'address': 2,
      'mlsNumber': 2,
      'salePrice': 2,
      'closingDate': 2,
      'county': 2,
      'propertyType': 2,
      'status': 2,
      'propertyAccessType': 2,
      'lockboxAccessCode': 2,

      // Client fields - Step 3
      'clients': 3,
      'client.name': 3,
      'client.phone': 3,
      'client.email': 3,
      'client.maritalStatus': 3,

      // Commission fields - Step 4
      'totalCommissionPercentage': 4,
      'listingAgentPercentage': 4,
      'buyersAgentPercentage': 4,
      'brokerFee': 4,
      'sellersAssist': 4,

      // Property Details fields - Step 5
      'municipality': 5,
      'hoaName': 5,
      'coRequired': 5,

      // Documents fields - Step 6
      'documents': 6,

      // Additional Info fields - Step 7
      'notes': 7,

      // Signature fields - Step 8
      'agentName': 8,
      'signature': 8,
      'infoConfirmed': 8,
      'termsAccepted': 8
    };

    // Find which step contains this field
    const step = fieldToStepMapping[field];
    if (step) {
      setCurrentStep(step);
      toast({
        title: "Navigated to field",
        description: `Now you can fix the missing ${field} field.`,
        variant: "default",
      });
    } else {
      console.error(`No mapping found for field: ${field}`);
      toast({
        title: "Navigation error",
        description: `Could not locate the field ${field}.`,
        variant: "destructive",
      });
    }
  };

  // Function to change background periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % artBackgrounds.length);
    }, 20000); // Change every 20 seconds

    return () => clearInterval(interval);
  }, []);

  // Effect to handle scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              const sectionIndex = parseInt(sectionId);
              if (!scrolledSections.includes(sectionIndex)) {
                setScrolledSections((prev) => [...prev, sectionIndex]);
                entry.target.classList.add('visible');
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [scrolledSections, currentStep]);

  // Effect to scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset scrolled sections when step changes
    setScrolledSections([]);
  }, [currentStep]);

  // Custom step click handler that adds scroll behavior
  const handleCustomStepClick = (step: number) => {
    // Scroll to top when clicking step navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleStepClick(step);
  };

  // Add the onChange handler for clients
  const clientsOnChange = (updatedClients: Client[]) => {
    setClients(updatedClients);
  };

  // Wrapper function to avoid naming conflicts
  const getSkippedFieldList = () => {
    return getAllSkippedFields();
  };

  // Animation variants for Framer Motion
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const stepVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.1, boxShadow: "0px 0px 15px rgba(212, 175, 55, 0.7)" }
  };

  const handleSubmit = async () => {
    try {
      await submitTransaction();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  // Set step references
  const setSectionRef = (index: number) => (ref: HTMLDivElement | null) => {
    sectionRefs.current[index] = ref;
  };

  // Since we removed the WarrantySection, adjust the total steps
  const totalSteps = 8;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div
          className="artistic-form artistic-form-container"
          style={{
            background: artBackgrounds[backgroundIndex],
            transition: "background 2s ease-in-out"
          }}
        >
          {/* Step wizard at top */}
          <div className="sticky top-0 z-30 art-step-wizard">
            <div className="container mx-auto">
              <ArtisticStepWizard
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleCustomStepClick}
                skippedFields={skippedFields}
              />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                {/* Header with welcome message for step 1 */}
                {currentStep === 1 && (
                  <div className="art-card p-6 mb-8 slide-in-left" ref={setSectionRef(0)} data-section-id="0">
                    <h1 className="art-header text-3xl sm:text-4xl mb-2">Welcome to Your Transaction Journey</h1>
                    <p className="art-subheader">Creating art from every real estate transaction</p>
                    <p className="mt-4 text-gray-600">
                      This artfully crafted form will guide you through submitting a new real estate transaction.
                      Each step transforms data into a masterpiece of precision.
                    </p>
                  </div>
                )}

                {/* Main form container */}
                <div className="art-card p-6 sm:p-8 art-form-section" ref={setSectionRef(1)} data-section-id="1">
                  <div className="mb-8">
                    {/* Content header for each step */}
                    <h2 className="art-header text-2xl sm:text-3xl mb-2">
                      {currentStep === 1 && "The Canvas of Your Role"}
                      {currentStep === 2 && "Property Portrait"}
                      {currentStep === 3 && "Client Composition"}
                      {currentStep === 4 && "The Art of Commission"}
                      {currentStep === 5 && "Property Masterpiece Details"}
                      {currentStep === 6 && "Document Gallery"}
                      {currentStep === 7 && "Additional Brushstrokes"}
                      {currentStep === 8 && "Final Showcase & Signature"}
                    </h2>
                    <p className="art-subheader mb-4">
                      {currentStep === 1 && "Select your position in this transaction masterpiece"}
                      {currentStep === 2 && "Sketch the details of your property"}
                      {currentStep === 3 && "Paint the portrait of your clients"}
                      {currentStep === 4 && "Structure the value exchange"}
                      {currentStep === 5 && "Add depth and dimension to the property details"}
                      {currentStep === 6 && "Curate the essential documents"}
                      {currentStep === 7 && "Add the finishing touches"}
                      {currentStep === 8 && "Review your creation and sign your masterpiece"}
                    </p>
                  </div>

                  {/* Form Content */}
                  <div className="space-y-6">
                    {currentStep === 1 && (
                      <RoleSelection
                        selectedRole={agentData.role}
                        onRoleChange={(value) => setAgentData(prev => ({ ...prev, role: value }))}
                        onAutofill={() => {}}
                      />
                    )}
                    {currentStep === 2 && (
                      <PropertyInformation
                        data={propertyData}
                        onChange={(field, value) => setPropertyData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                      />
                    )}
                    {currentStep === 3 && (
                      <div className="art-client-container">
                        <ArtisticClientSection
                          clients={clients}
                          onChange={setClients}
                          role={agentData.role}
                          onAddClient={() => {
                            const newClient: Client = {
                              id: uuidv4(),
                              name: "",
                              email: "",
                              phone: "",
                              address: "",
                              maritalStatus: "",
                              type: agentData.role === "LISTING AGENT" ? "SELLER" : "BUYER",
                            };
                            setClients([...clients, newClient]);
                          }}
                          onRemoveClient={(id) => {
                            setClients(clients.filter(client => client.id !== id));
                          }}
                          onClientChange={(id, field, value) => {
                            setClients(clients.map(client =>
                              client.id === id ? { ...client, [field]: value } : client
                            ));
                          }}
                        />
                      </div>
                    )}
                    {currentStep === 4 && (
                      <CommissionSection
                        data={commissionData}
                        onChange={(field, value) => setCommissionData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                      />
                    )}
                    {currentStep === 5 && (
                      <PropertyDetailsSection
                        data={propertyDetails}
                        onChange={(field, value) => setPropertyDetails(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                        titleData={titleData}
                        onTitleChange={(field, value) => setTitleData(prev => ({ ...prev, [field]: value }))}
                      />
                    )}
                    {currentStep === 6 && (
                      <DocumentsSection
                        data={documentsData}
                        onChange={(field, value) => setDocumentsData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                        titleData={titleData}
                        propertyData={propertyData}
                        commissionData={commissionData}
                      />
                    )}
                    {currentStep === 7 && (
                      <AdditionalInfoSection
                        data={additionalInfo}
                        onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value }))}
                      />
                    )}
                    {currentStep === 8 && (
                      <div className="space-y-12">
                        {/* Show review section first */}
                        <div className="art-review-section fade-in">
                          <h3 className="art-review-header text-xl font-bold mb-4">Your Transaction Masterpiece</h3>
                          <p className="text-gray-600 mb-6">
                            Review all elements of your transaction canvas before adding your final signature.
                          </p>
                          <ReviewSection
                            data={{
                              agentData,
                              propertyData,
                              clients,
                              commissionData,
                              propertyDetailsData: propertyDetails,
                              titleData,
                              additionalInfo,
                              signatureData,
                              documentsData
                            }}
                            skippedFields={getSkippedFieldList()}
                            onFieldFix={handleFixField}
                          />
                        </div>

                        {/* Show signature section last */}
                        <div className="art-submit-section slide-in-right">
                          <h3 className="art-header text-xl font-bold mb-4">Your Artist's Signature</h3>
                          <p className="text-gray-200 mb-6">
                            With your signature, you authenticate this transaction as your own creation.
                          </p>
                          <SignatureSection
                            data={signatureData}
                            onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                            role={agentData.role}
                            skippedFields={getSkippedFieldList()}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                    {/* Back button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className={`art-button ${currentStep === 1 ? 'opacity-0' : 'opacity-100'} transition-opacity px-6 py-5 text-base`}
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Previous
                      </Button>
                    </motion.div>

                    {/* Next/Submit button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentStep < 8 ? (
                        <Button
                          onClick={handleNext}
                          className="art-button art-button-next px-6 py-5 text-base"
                        >
                          Next Canvas
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          className="art-button art-button-submit px-6 py-5 text-base"
                          disabled={submitting || !signatureData.signature || !signatureData.infoConfirmed || !signatureData.termsAccepted}
                        >
                          {submitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              Creating...
                            </>
                          ) : (
                            <>
                              Complete Masterpiece
                              <PenTool className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            {showProgressOverlay && (
              <SubmissionProgress
                steps={submissionSteps}
                currentStep={currentSubmissionStep}
                error={submissionError}
                onClose={closeProgressOverlay}
                isOpen={showProgressOverlay}
              />
            )}

            {/* Toast containers */}
            <Toaster />
            <SonnerToaster position="top-center" />

            {/* Validation bypass component */}
            {showValidationUI && (
              <ValidationBypassButtons
                errorCount={Object.keys(validationErrors).length}
                errors={validationErrors}
                onContinue={handleContinueWithErrors}
                onFix={handleFixField}
                onClose={closeValidationUI}
              />
            )}
          </div>

          {/* Artistic footer */}
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="footer-quote">
              Every transaction is a work of art, carefully crafted with expertise and precision
            </p>
            <div className="footer-dots">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="footer-dot"
                  style={{
                    animation: `pulse 2s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
