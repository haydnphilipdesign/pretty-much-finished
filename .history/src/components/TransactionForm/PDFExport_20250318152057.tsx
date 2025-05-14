import React from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TransactionFormData } from "@/types/transaction";
import { formatAddress } from "@/utils/addressUtils";

interface PDFExportProps {
  data: TransactionFormData;
  transactionId?: string;
}

export function PDFExport({ data, transactionId }: PDFExportProps) {
  const generatePDF = async () => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
    
    // Get fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Set properties for drawing
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    const lineHeight = 24;
    
    // Draw header with logo placeholder
    page.drawText('REAL ESTATE TRANSACTION SUMMARY', {
      x: margin,
      y,
      size: 16,
      font: helveticaBold,
    });
    
    y -= lineHeight * 2;
    
    // Draw transaction ID if available
    if (transactionId) {
      page.drawText(`Transaction ID: ${transactionId}`, {
        x: margin,
        y,
        size: 10,
        font: helveticaFont,
      });
      y -= lineHeight;
    }
    
    // Draw date
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= lineHeight * 2;
    
    // Draw section: Property Information
    page.drawText('PROPERTY INFORMATION', {
      x: margin,
      y,
      size: 12,
      font: helveticaBold,
    });
    y -= lineHeight;
    
    // Format property address
    const propertyAddress = formatAddress(
      data.propertyData.streetAddress,
      data.propertyData.city,
      data.propertyData.state,
      data.propertyData.zipCode
    );
    
    page.drawText(`MLS #: ${data.propertyData.mlsNumber}`, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= lineHeight;
    
    page.drawText(`Address: ${propertyAddress}`, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= lineHeight;
    
    page.drawText(`Sale Price: $${data.propertyData.salePrice}`, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= lineHeight * 2;
    
    // Draw section: Agent Information
    page.drawText('AGENT INFORMATION', {
      x: margin,
      y,
      size: 12,
      font: helveticaBold,
    });
    y -= lineHeight;
    
    page.drawText(`Agent: ${data.agentData.agentName}`, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= lineHeight;
    
    page.drawText(`Role: ${data.agentData.role}`, {
      x: margin,
      y,
      size: 10,
      font: helveticaFont,
    });
    y -= lineHeight * 2;
    
    // Draw clients section
    page.drawText('CLIENT INFORMATION', {
      x: margin,
      y,
      size: 12,
      font: helveticaBold,
    });
    y -= lineHeight;
    
    data.clients.forEach((client, index) => {
      // Format client address
      const clientAddress = formatAddress(
        client.streetAddress,
        client.city,
        client.state,
        client.zipCode
      );
      
      page.drawText(`Client ${index + 1}: ${client.name} (${client.type.toUpperCase()})`, {
        x: margin,
        y,
        size: 10,
        font: helveticaFont,
      });
      y -= lineHeight;
      
      page.drawText(`Email: ${client.email}`, {
        x: margin + 20,
        y,
        size: 10,
        font: helveticaFont,
      });
      y -= lineHeight;
      
      page.drawText(`Phone: ${client.phone}`, {
        x: margin + 20,
        y,
        size: 10,
        font: helveticaFont,
      });
      y -= lineHeight;
      
      page.drawText(`Address: ${clientAddress}`, {
        x: margin + 20,
        y,
        size: 10,
        font: helveticaFont,
      });
      y -= lineHeight * 1.5;
    });
    
    // Add more sections for commission, etc.
    // Check if we need to add a new page
    if (y < height / 2) {
      const newPage = pdfDoc.addPage([612, 792]);
      y = height - margin;
      // Continue with additional sections
    }
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    // Download the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Transaction_${transactionId || new Date().getTime()}.pdf`;
    link.click();
  };
  
  return (
    <Button 
      onClick={generatePDF}
      variant="outline"
      className="w-full flex items-center gap-2"
    >
      <Download size={16} />
      Download PDF
    </Button>
  );
} 