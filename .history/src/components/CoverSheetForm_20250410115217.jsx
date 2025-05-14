import React, { useState } from 'react';
import { generateAndSendCoverSheet } from '../utils/clientUtils';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CoverSheetForm = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await generateAndSendCoverSheet(formData, role);
            // Reset form after successful submission
            setFormData({});
            setRole('');
        } catch (error) {
            // Error handling is done by the clientUtils function
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="cover-sheet-form">
            <ToastContainer />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="buyer">Buyer's Agent</option>
                        <option value="seller">Listing Agent</option>
                        <option value="dual">Dual Agent</option>
                    </Form.Select>
                </Form.Group>

                {/* Add your form fields here */}
                
                <Button 
                    type="submit" 
                    disabled={loading || !role}
                    className="mt-3"
                >
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Generating...
                        </>
                    ) : (
                        'Generate Cover Sheet'
                    )}
                </Button>
            </Form>
        </div>
    );
};

export default CoverSheetForm; 