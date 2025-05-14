import { useTransactionForm } from '@/context/TransactionFormContext';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Home, Users, UserCog, ChevronLeft, ChevronRight } from 'lucide-react';
import { AgentRole } from '@/types/transaction';
import Image from 'next/image';

export const StyledTransactionForm = () => {
  const { state, dispatch } = useTransactionForm();

  const handleRoleSelection = (role: AgentRole) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  return (
    <div className="min-h-screen bg-[#0A192F] p-6 flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-[#2A4374]/30 backdrop-blur-2xl shadow-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/images/logo.png" 
            alt="PA Real Estate Support Services" 
            width={220} 
            height={70} 
          />
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 px-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${state.currentStep >= 1 ? 'bg-white text-[#0A192F]' : 'bg-white/30 text-white/70'}`}>
              1
            </div>
            <span className="text-white text-xs mt-2">Role Selection</span>
          </div>
          
          <div className="h-[1px] flex-1 mx-3 bg-white/20 relative">
            <div className={`absolute top-0 left-0 h-full bg-white transition-all duration-300 ${state.currentStep > 1 ? 'w-full' : 'w-0'}`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${state.currentStep >= 2 ? 'bg-white text-[#0A192F]' : 'bg-white/30 text-white/70'}`}>
              2
            </div>
            <span className="text-white text-xs mt-2">Property Information</span>
          </div>
          
          <div className="h-[1px] flex-1 mx-3 bg-white/20 relative">
            <div className={`absolute top-0 left-0 h-full bg-white transition-all duration-300 ${state.currentStep > 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${state.currentStep >= 3 ? 'bg-white text-[#0A192F]' : 'bg-white/30 text-white/70'}`}>
              3
            </div>
            <span className="text-white text-xs mt-2">Client Information</span>
          </div>
          
          <div className="h-[1px] flex-1 mx-3 bg-white/20 relative">
            <div className="absolute top-0 left-0 h-full bg-white/20"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/60"></div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-white/60 text-xs whitespace-nowrap">
              ...
            </div>
          </div>
          
          <div className="h-[1px] flex-1 mx-3 bg-white/20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/60"></div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-white/60 text-xs whitespace-nowrap">
              ...
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${state.currentStep >= 9 ? 'bg-white text-[#0A192F]' : 'bg-white/30 text-white/70'}`}>
              9
            </div>
            <span className="text-white text-xs mt-2">Signature</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-[2px] bg-white/10 mb-12 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-500"
            style={{ width: `${(state.currentStep / 9) * 100}%` }}
          ></div>
        </div>

        {state.currentStep === 1 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-white mb-3">Select Your Role</h2>
            <p className="text-white/70 mb-8">Choose your role in this real estate transaction to continue with the appropriate workflow</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <button
                onClick={() => handleRoleSelection("listingAgent" as AgentRole)}
                className={`group bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all duration-300 border ${state.selectedRole === ("listingAgent" as unknown as AgentRole) ? 'border-white' : 'border-transparent'}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-xl">Listing Agent</h3>
                    <p className="text-white/60 mt-2">Representing the seller in this transaction</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("buyersAgent" as AgentRole)}
                className={`group bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all duration-300 border ${state.selectedRole === ("buyersAgent" as unknown as AgentRole) ? 'border-white' : 'border-transparent'}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-xl">Buyer's Agent</h3>
                    <p className="text-white/60 mt-2">Representing the buyer in this transaction</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("dualAgent" as AgentRole)}
                className={`group bg-white/10 hover:bg-white/15 rounded-xl p-6 transition-all duration-300 border ${state.selectedRole === ("dualAgent" as unknown as AgentRole) ? 'border-white' : 'border-transparent'}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <UserCog className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-xl">Dual Agent</h3>
                    <p className="text-white/60 mt-2">Representing both parties in this transaction</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {state.currentStep === 2 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-white mb-3">Property Information</h2>
            <p className="text-white/70 mb-8">Enter the details about the property</p>

            <div className="bg-white/10 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-6">
                <Home className="text-white mr-3" />
                <h3 className="text-white text-xl font-medium">Property Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mlsNumber" className="text-white">MLS Number <span className="text-red-400">*</span></Label>
                  <Input
                    id="mlsNumber"
                    placeholder="Enter 6 digits"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-0"
                    value={state.formData.propertyData.mlsNumber}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_FORM_DATA',
                      payload: { propertyData: { ...state.formData.propertyData, mlsNumber: e.target.value } }
                    })}
                  />
                  <p className="text-white/50 text-xs">Format example: 123456</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice" className="text-white">Sale Price <span className="text-red-400">*</span></Label>
                  <Input
                    id="salePrice"
                    type="text"
                    placeholder="Enter sale price"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-0"
                    value={state.formData.propertyData.salePrice}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_FORM_DATA',
                      payload: { propertyData: { ...state.formData.propertyData, salePrice: e.target.value } }
                    })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="propertyAddress" className="text-white">Property Address <span className="text-red-400">*</span></Label>
                  <Input
                    id="propertyAddress"
                    placeholder="Enter full property address"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-0"
                    value={state.formData.propertyData.address}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_FORM_DATA',
                      payload: { propertyData: { ...state.formData.propertyData, address: e.target.value } }
                    })}
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-white mb-2 block">Property Status <span className="text-red-400">*</span></Label>
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="vacant" 
                        name="propertyStatus" 
                        className="mr-2"
                      />
                      <label htmlFor="vacant" className="text-white">Vacant</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="occupied" 
                        name="propertyStatus" 
                        className="mr-2"
                      />
                      <label htmlFor="occupied" className="text-white">Occupied</label>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex items-center mt-2">
                  <div className="w-10 h-5 relative">
                    <input 
                      type="checkbox" 
                      id="updateMLS"
                      className="opacity-0 w-0 h-0 absolute"
                    />
                    <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-white/20 transition-all duration-300 rounded-full before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition-all before:duration-300"></span>
                  </div>
                  <label htmlFor="updateMLS" className="text-white ml-3">Update MLS status</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="ghost"
            disabled={state.currentStep === 1}
            onClick={() => dispatch({ type: 'SET_STEP', payload: Math.max(1, state.currentStep - 1) })}
            className="text-white hover:bg-white/10 disabled:opacity-50 flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          <Button
            onClick={() => dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 })}
            disabled={state.currentStep === 1 && !state.selectedRole}
            className="bg-[#E5BE74] hover:bg-[#d4ad63] text-[#0A192F] flex items-center disabled:opacity-50"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

