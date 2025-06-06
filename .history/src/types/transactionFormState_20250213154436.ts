// transactionFormState.ts
import { AgentRole } from '@/types/transaction';

export interface TransactionFormState {
  currentStep: number;
  formData: FormData;
  selectedRole: AgentRole | null;
  isSubmitting: boolean;
}
