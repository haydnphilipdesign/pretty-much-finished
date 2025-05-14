/**
 * Utility to check PDF template accessibility
 * This helps diagnose issues with PDF generation in the production environment
 */

/**
 * Checks if the PDF template is accessible via various methods
 * @returns Promise resolving to the check results
 */
export async function checkPdfTemplateAccess(): Promise<any> {
  try {
    // Get the bypass secret from environment
    const BYPASS_SECRET = process.env.NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET;
    
    if (!BYPASS_SECRET) {
      console.warn('Bypass secret not available for template checking');
      return {
        success: false,
        error: 'Authentication not available'
      };
    }
    
    console.log('Checking PDF template accessibility...');
    
    // Call the template checker API
    const response = await fetch('/api/check-pdf-template', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BYPASS_SECRET}`,
        'bypass_secret': BYPASS_SECRET
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Template check failed: ${response.status}`, errorText);
      return {
        success: false,
        statusCode: response.status,
        error: errorText
      };
    }
    
    // Parse and return the results
    const results = await response.json();
    console.log('Template accessibility results:', results);
    
    return results;
  } catch (error) {
    console.error('Error checking template accessibility:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Provides recommendations for fixing template issues based on check results
 * @param results The results from checkPdfTemplateAccess
 * @returns Recommendations and actions that can be taken
 */
export function getTemplateRecommendations(results: any): string[] {
  const recommendations: string[] = [];
  
  if (!results || !results.success) {
    recommendations.push('⚠️ No accessible PDF template methods found. This will cause PDF generation to fail.');
    
    // Check if any paths exist
    const existingPaths = results?.paths?.filter((p: any) => p.exists) || [];
    if (existingPaths.length === 0) {
      recommendations.push('✅ Add the PDF template file to the public directory.');
    }
    
    // Check if embedded template is available
    if (!results?.embeddedTemplate?.available) {
      recommendations.push('✅ Configure the PDF_TEMPLATE_BASE64 environment variable with a base64-encoded template.');
    }
    
    // Check if template URL is available and accessible
    if (!results?.templateUrl?.available) {
      recommendations.push('✅ Configure the PDF_TEMPLATE_URL environment variable with a URL to download the template.');
    } else if (!results?.templateUrl?.accessible) {
      recommendations.push('🔄 The configured template URL is not accessible. Check the URL and ensure it allows access from the server.');
    }
    
    // General advice
    recommendations.push('✅ Run the template checker after deployment to verify template accessibility.');
  } else {
    recommendations.push(`✅ PDF template is accessible via ${results.accessibleMethods.length} methods:`);
    results.accessibleMethods.forEach((method: string) => {
      recommendations.push(`  - ${method}`);
    });
    
    // Add any improvement suggestions
    if (!results.paths.some((p: any) => p.exists)) {
      recommendations.push('ℹ️ Consider adding the template to the public directory for better performance.');
    }
    
    if (!results.embeddedTemplate.available) {
      recommendations.push('ℹ️ Consider adding a base64-encoded template as a fallback.');
    }
    
    if (!results.templateUrl.available) {
      recommendations.push('ℹ️ Consider configuring a template URL as an additional fallback.');
    }
  }
  
  return recommendations;
}

/**
 * Helper function to embed a PDF file as base64 for environment variable
 * This can be used to generate the PDF_TEMPLATE_BASE64 value
 * @param filePath Path to the PDF file
 * @returns Base64-encoded PDF content
 */
export async function generateBase64Template(filePath: string): Promise<string> {
  try {
    // This function is meant to be used in a Node.js environment (not in the browser)
    if (typeof window !== 'undefined') {
      throw new Error('This function is meant to be used in a Node.js environment');
    }
    
    // Import Node.js modules (this won't work in the browser)
    const fs = await import('fs/promises');
    
    // Read the file
    const fileData = await fs.readFile(filePath);
    
    // Convert to base64
    const base64Data = fileData.toString('base64');
    
    return base64Data;
  } catch (error) {
    console.error('Error generating base64 template:', error);
    throw error;
  }
}