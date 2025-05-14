import React, { useState } from 'react';
import { generateAndSendCoverSheet } from '../utils/clientUtils';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CoverSheetForm = () => {
    const [formData, setFormData] = useState({
        propertyData: {},
        agentData: {},
        commissionData: {},
        additionalInfo: {}
    });
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Structure the data for the API
            const apiData = {
                propertyData: {
                    address: formData.propertyData.address,
                    mlsNumber: formData.propertyData.mlsNumber,
                    salePrice: formData.propertyData.salePrice,
                    status: formData.propertyData.status || 'Pending',
                    isWinterized: formData.propertyData.isWinterized || false
                },
                agentData: {
                    name: formData.agentData.name,
                    email: formData.agentData.email,
                    phone: formData.agentData.phone,
                    role: role.toUpperCase()
                },
                commissionData: {
                    totalCommissionPercentage: formData.commissionData.totalCommissionPercentage,
                    listingAgentPercentage: formData.commissionData.listingAgentPercentage,
                    buyersAgentPercentage: formData.commissionData.buyersAgentPercentage,
                    brokerFee: formData.commissionData.brokerFee
                },
                additionalInfo: {
                    specialInstructions: formData.additionalInfo.specialInstructions,
                    urgentIssues: formData.additionalInfo.urgentIssues || false,
                    notes: formData.additionalInfo.notes
                }
            };

            await generateAndSendCoverSheet(apiData, role.toUpperCase());
            // Reset form after successful submission
            setFormData({
                propertyData: {},
                agentData: {},
                commissionData: {},
                additionalInfo: {}
            });
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
        const [section, field] = name.split('.');

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
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
                        <option value="BUYERS AGENT">Buyer's Agent</option>
                        <option value="LISTING AGENT">Listing Agent</option>
                        <option value="DUAL AGENT">Dual Agent</option>
                    </Form.Select>
                </Form.Group>

                {/* Property Information */}
                <Form.Group className="mb-3">
                    <Form.Label>Property Information</Form.Label>
                    <Form.Control
                        type="text"
                        name="propertyData.address"
                        placeholder="Property Address"
                        value={formData.propertyData.address || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="text"
                        name="propertyData.mlsNumber"
                        placeholder="MLS Number"
                        value={formData.propertyData.mlsNumber || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="number"
                        name="propertyData.salePrice"
                        placeholder="Sale Price"
                        value={formData.propertyData.salePrice || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Select
                        name="propertyData.status"
                        value={formData.propertyData.status || 'Pending'}
                        onChange={handleInputChange}
                        className="mb-2"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                        <option value="Withdrawn">Withdrawn</option>
                    </Form.Select>
                </Form.Group>

                {/* Agent Information */}
                <Form.Group className="mb-3">
                    <Form.Label>Agent Information</Form.Label>
                    <Form.Control
                        type="text"
                        name="agentData.name"
                        placeholder="Agent Name"
                        value={formData.agentData.name || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="email"
                        name="agentData.email"
                        placeholder="Agent Email"
                        value={formData.agentData.email || ''}
                        onChange={handleInputChange}
                        required
                        className="mb-2"
                    />
                    <Form.Control
                        type="tel"
                        name="agentData.phone"
                        placeholder="Agent Phone"
                        value={formData.agentData.phone || ''}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                {/* Commission Information */}
                <Form.Group className="mb-3">
                    <Form.Label>Commission Information</Form.Label>
                    <Form.Control
                        type="number"
                        name="commissionData.totalCommissionPercentage"
                        placeholder="Total Commission %"
                        value={formData.commissionData.totalCommissionPercentage || ''}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        max="100"
                        className="mb-2"
                    />
                    {role !== 'DUAL AGENT' && (
                        <>
                            <Form.Control
                                type="number"
                                name="commissionData.listingAgentPercentage"
                                placeholder="Listing Agent %"
                                value={formData.commissionData.listingAgentPercentage || ''}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                max="100"
                                className="mb-2"
                            />
                            <Form.Control
                                type="number"
                                name="commissionData.buyersAgentPercentage"
                                placeholder="Buyer's Agent %"
                                value={formData.commissionData.buyersAgentPercentage || ''}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                max="100"
                                className="mb-2"
                            />
                        </>
                    )}
                    <Form.Control
                        type="number"
                        name="commissionData.brokerFee"
                        placeholder="Broker Fee"
                        value={formData.commissionData.brokerFee || ''}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                    />
                </Form.Group>

                {/* Additional Information */}
                <Form.Group className="mb-3">
                    <Form.Label>Additional Information</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="additionalInfo.specialInstructions"
                        placeholder="Special Instructions"
                        value={formData.additionalInfo.specialInstructions || ''}
                        onChange={handleInputChange}
                        rows={2}
                        className="mb-2"
                    />
                    <Form.Check
                        type="checkbox"
                        name="additionalInfo.urgentIssues"
                        label="Urgent Issues"
                        checked={formData.additionalInfo.urgentIssues || false}
                        onChange={(e) => handleInputChange({
                            target: {
                                name: 'additionalInfo.urgentIssues',
                                value: e.target.checked
                            }
                        })}
                        className="mb-2"
                    />
                    <Form.Control
                        as="textarea"
                        name="additionalInfo.notes"
                        placeholder="Additional Notes"
                        value={formData.additionalInfo.notes || ''}
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