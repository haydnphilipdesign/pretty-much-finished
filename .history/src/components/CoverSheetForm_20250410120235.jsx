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
                <Form.Group className="mb-3">
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

                <Form.Group className="mb-3">
                    <Form.Label>Transaction Details</Form.Label>
                    <Form.Control
                        type="text"
                        name="propertyAddress"
                        placeholder="Property Address"
                        value={formData.propertyAddress || ''}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Client Information</Form.Label>
                    <Form.Control
                        type="text"
                        name="clientName"
                        placeholder="Client Name"
                        value={formData.clientName || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="email"
                        name="clientEmail"
                        placeholder="Client Email"
                        value={formData.clientEmail || ''}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Transaction Status</Form.Label>
                    <Form.Control
                        type="date"
                        name="contractDate"
                        placeholder="Contract Date"
                        value={formData.contractDate || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="date"
                        name="closingDate"
                        placeholder="Closing Date"
                        value={formData.closingDate || ''}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Financial Details</Form.Label>
                    <Form.Control
                        type="number"
                        name="salePrice"
                        placeholder="Sale Price"
                        value={formData.salePrice || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="number"
                        name="commission"
                        placeholder="Commission %"
                        value={formData.commission || ''}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        max="100"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="notes"
                        placeholder="Additional Notes"
                        value={formData.notes || ''}
                        onChange={handleInputChange}
                        rows={3}
                    />
                </Form.Group>

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