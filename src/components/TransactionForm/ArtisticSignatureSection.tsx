import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PenTool, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";
import type { AgentRole } from "@/types/transaction";

interface SignatureData {
  signature: string;
  infoConfirmed: boolean;
  termsAccepted: boolean;
  agentName: string;
  dateSubmitted: string;
}

interface ArtisticSignatureSectionProps {
  data: SignatureData;
  onChange: (field: keyof SignatureData, value: any) => void;
  role?: AgentRole;
  skippedFields?: string[];
}

export function ArtisticSignatureSection({
  data,
  onChange,
  role = "LISTING AGENT",
  skippedFields = []
}: ArtisticSignatureSectionProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [canvasKey, setCanvasKey] = useState(0); // For forcing re-render
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<{ x: number, y: number, size: number, color: string, vx: number, vy: number, life: number }[]>([]);

  // Effect to create particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
            size: p.life > 15 ? p.size : p.size * 0.9
          }))
          .filter(p => p.life > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const addParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 3 }, () => ({
      x,
      y,
      size: Math.random() * 4 + 2,
      color: ['#D4AF37', '#F5E7A0', '#614E3D'][Math.floor(Math.random() * 3)],
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 30 + Math.random() * 20
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Handler for moving the pen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (Math.random() > 0.7) { // Only add particles sometimes for performance
        addParticles(x, y);
      }
    }
  };

  // Check if signature exists when component mounts
  useEffect(() => {
    if (data.signature) {
      setSignatureComplete(true);
    }
  }, [data.signature]);

  // Function to clear signature
  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      onChange("signature", "");
      setSignatureComplete(false);
      setCanvasKey(prev => prev + 1); // Force re-render of canvas
    }
  };

  // Function to save signature
  const saveSignature = () => {
    if (sigCanvas.current) {
      if (!sigCanvas.current.isEmpty()) {
        const dataURL = sigCanvas.current.toDataURL("image/png");
        onChange("signature", dataURL);
        setSignatureComplete(true);
        setShowMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    }
  };

  // Calculate missing fields excluding signature-related ones
  const relevantSkippedFields = skippedFields.filter(
    field => !['signature', 'infoConfirmed', 'termsAccepted', 'agentName'].includes(field)
  );

  const warningVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const canvasVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="art-signature-section">
      {/* Missing fields warning */}
      {relevantSkippedFields.length > 0 && (
        <motion.div 
          className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md"
          variants={warningVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <XCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Attention Required</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>There are {relevantSkippedFields.length} fields you've skipped or left incomplete:</p>
                <ul className="mt-1 list-disc list-inside">
                  {relevantSkippedFields.slice(0, 3).map((field, index) => (
                    <li key={index} className="text-sm">
                      {field.replace(/([A-Z])/g, ' $1').toLowerCase().charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').toLowerCase().slice(1)}
                    </li>
                  ))}
                  {relevantSkippedFields.length > 3 && (
                    <li className="text-sm">
                      ...and {relevantSkippedFields.length - 3} more
                    </li>
                  )}
                </ul>
                <p className="mt-2 text-amber-800 font-medium">You can still continue, but some information may be missing.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Agent name field */}
      <div className="mb-6">
        <Label htmlFor="agentName" className="art-label block mb-2">
          Your Full Name (as it appears on your license)
        </Label>
        <Input
          id="agentName"
          name="agentName"
          value={data.agentName}
          onChange={(e) => onChange("agentName", e.target.value)}
          className="art-input w-full"
          required
        />
      </div>

      {/* Date field (auto-populated) */}
      <div className="mb-6">
        <Label htmlFor="dateSubmitted" className="art-label block mb-2">
          Date of Signature
        </Label>
        <Input
          id="dateSubmitted"
          name="dateSubmitted"
          value={data.dateSubmitted}
          className="art-input w-full bg-gray-50"
          readOnly
        />
      </div>

      {/* Signature Canvas */}
      <div className="mb-8">
        <Label htmlFor="signature" className="art-label block mb-2">
          Your Artistic Signature
        </Label>
        
        <motion.div 
          className="relative"
          variants={canvasVariants}
          initial="initial"
          animate="animate"
        >
          {/* Particles layer */}
          <div 
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
            style={{ 
              width: '100%',
              height: '200px',
            }}
          >
            {particles.map((p, i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  opacity: p.life / 50
                }}
              />
            ))}
          </div>
          
          {/* Signature success overlay */}
          {signatureComplete && (
            <motion.div 
              className="absolute inset-0 bg-green-50 bg-opacity-60 flex items-center justify-center z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: showMessage ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate={showMessage ? "visible" : "hidden"}
                className="bg-white rounded-lg p-4 shadow-lg flex items-center"
              >
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">Signature captured beautifully!</span>
              </motion.div>
            </motion.div>
          )}
          
          {/* The actual signature canvas */}
          <div 
            className="relative border border-dashed border-amber-300 rounded-lg overflow-hidden bg-white"
            style={{ height: '200px' }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
          >
            <SignatureCanvas
              ref={sigCanvas}
              key={canvasKey}
              canvasProps={{
                className: "art-signature-pad",
                width: 600,
                height: 200,
                style: { width: '100%', height: '100%' },
              }}
              backgroundColor="rgba(255, 255, 255, 0)"
              penColor="#212A3E"
            />
            
            {/* Initial prompt if no signature */}
            {!data.signature && !isDragging && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400">
                <div className="text-center">
                  <PenTool className="h-6 w-6 mx-auto mb-2" />
                  <p>Sign here to complete your masterpiece</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Signature action buttons */}
          <div className="flex justify-end space-x-3 mt-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={clearSignature}
              className="art-button bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button 
              type="button" 
              onClick={saveSignature}
              className="art-button art-button-next"
              disabled={signatureComplete}
            >
              <PenTool className="h-4 w-4 mr-2" />
              {signatureComplete ? "Signature Saved" : "Save Signature"}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Confirmation checkboxes */}
      <div className="space-y-4 mb-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="infoConfirmed"
            checked={data.infoConfirmed}
            onCheckedChange={(checked) => onChange("infoConfirmed", Boolean(checked))}
            className="h-5 w-5 mt-1 rounded-sm border-2 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          />
          <Label htmlFor="infoConfirmed" className="text-gray-700">
            I confirm that all information provided in this transaction is accurate and complete to the best of my knowledge.
          </Label>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="termsAccepted"
            checked={data.termsAccepted}
            onCheckedChange={(checked) => onChange("termsAccepted", Boolean(checked))}
            className="h-5 w-5 mt-1 rounded-sm border-2 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          />
          <Label htmlFor="termsAccepted" className="text-gray-700">
            I agree to the terms and conditions of the real estate transaction process and understand my responsibilities as {role.toLowerCase()}.
          </Label>
        </div>
      </div>

      {/* Submission requirements reminder */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Before You Submit:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
          <li>Your electronic signature is legally binding</li>
          <li>Both confirmation checkboxes must be checked</li>
          <li>Your full name must be provided</li>
          <li>Review all information for accuracy</li>
        </ul>
      </div>
      
      {/* Visual flourish elements */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-20 blur-2xl"></div>
    </div>
  );
}
