// Client utilities for PDF generation and email handling
import { toast } from 'react-toastify';

export const generateAndSendCoverSheet = async(data, role) => {
    try {
        const response = await fetch('/api/generateCoverSheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data, role }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Check if the error is due to validation
            if (response.status === 400 && result.validationErrors) {
                // Display validation errors
                result.validationErrors.forEach(error => {
                    const severity = error.severity || 'error';
                    toast[severity === 'warning' ? 'warn' : 'error'](
                        `${error.field}: ${error.message}`, {
                            position: "top-right",
                            autoClose: severity === 'warning' ? 5000 : false,
                            closeOnClick: true,
                            pauseOnhover:true,
                        }
                    );
                });
                throw new Error('Validation failed. Please check the form for errors.');
            }
            throw new Error(result.message || 'Failed to generate cover sheet');
        }

        // Show success message
        toast.success('Cover sheet generated and sent successfully!', {
            position: "top-right",
            autoClose: 3000,
        });

        return result;
    } catch (error) {
        console.error('Error generating cover sheet:', error);
        // Show error message if not already shown by validation
        if (!error.message.includes('Validation failed')) {
            toast.error(`Error: ${error.message}`, {
                position: "top-right",
                autoClose: false,
            });
        }
        throw error;
    }
};