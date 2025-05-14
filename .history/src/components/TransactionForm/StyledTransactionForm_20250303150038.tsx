import { useTransactionForm } from '@/context/TransactionFormContext';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Home, Users, FileText } from 'lucide-react';
import { AgentRole } from '@/types/transaction';

export const StyledTransactionForm = () => {
  const { state, dispatch } = useTransactionForm();

  const handleRoleSelection = (role: AgentRole) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#112240] p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[80px]" />
        <div className="absolute top-[30%] left-[10%] w-[25%] h-[25%] bg-purple-400/10 rounded-full blur-[60px]" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md ${state.currentStep >= 1 ? 'bg-blue-500/90 shadow-lg shadow-blue-500/20' : 'bg-gray-400/30 border border-gray-400/30'}`}>
              1
            </div>
            <span className="text-white font-medium">Role Selection</span>
          </div>
          <div className="flex-1 mx-4 h-1 bg-gray-400/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div className={`h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ${state.currentStep >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md ${state.currentStep >= 2 ? 'bg-blue-500/90 shadow-lg shadow-blue-500/20' : 'bg-gray-400/30 border border-gray-400/30'}`}>
              2
            </div>
            <span className="text-white font-medium">Property Information</span>
          </div>
        </div>

        {/* Form Content */}
        <Card className="bg-white/10 backdrop-blur-2xl shadow-xl rounded-2xl p-8 border border-white/30 relative overflow-hidden">
          {/* Card inner glow/highlights */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
          {state.currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Select Your Role</h2>
              <p className="text-gray-600">Choose your role in this real estate transaction</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <button
                  onClick={() => handleRoleSelection("buyersAgent" as AgentRole)}
                  className={`p-6 rounded-xl border-2 transition-all ${state.selectedRole === ("buyersAgent" as unknown as AgentRole) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Users className="w-12 h-12 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">Buyer's Agent</h3>
                      <p className="text-sm text-gray-500 mt-1">Representing the buyer in this transaction</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection("listingAgent" as AgentRole)}
                  className={`p-6 rounded-xl border-2 transition-all ${state.selectedRole === ("listingAgent" as unknown as AgentRole) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Home className="w-12 h-12 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">Listing Agent</h3>
                      <p className="text-sm text-gray-500 mt-1">Representing the seller in this transaction</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelection("dualAgent" as AgentRole)}
                  className={`p-6 rounded-xl border-2 transition-all ${state.selectedRole === ("dualAgent" as unknown as AgentRole) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <FileText className="w-12 h-12 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">Dual Agent</h3>
                      <p className="text-sm text-gray-500 mt-1">Representing both parties in this transaction</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {state.currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Property Information</h2>
              <p className="text-gray-600">Enter the details about the property</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="mlsNumber" className="text-gray-700">MLS Number</Label>
                  <Input
                    id="mlsNumber"
                    placeholder="Enter 6 digits"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={state.formData.propertyData.mlsNumber}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_FORM_DATA',
                      payload: { propertyData: { ...state.formData.propertyData, mlsNumber: e.target.value } }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice" className="text-gray-700">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="text"
                    placeholder="Enter sale price"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={state.formData.propertyData.salePrice}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_FORM_DATA',
                      payload: { propertyData: { ...state.formData.propertyData, salePrice: e.target.value } }
                    })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="propertyAddress" className="text-gray-700">Property Address</Label>
                  <Input
                    id="propertyAddress"
                    placeholder="Enter full property address"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={state.formData.propertyData.address}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_FORM_DATA',
                      payload: { propertyData: { ...state.formData.propertyData, address: e.target.value } }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => dispatch({ type: 'SET_STEP', payload: Math.max(1, state.currentStep - 1) })}
              disabled={state.currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 })}
              disabled={!state.selectedRole || state.currentStep >= 9}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

