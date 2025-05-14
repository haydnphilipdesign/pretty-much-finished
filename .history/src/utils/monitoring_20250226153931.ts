import { TransactionFormData } from '@/types/transaction';

interface SubmissionLog {
  timestamp: string;
  transactionId: string;
  mlsNumber: string;
  address: string;
  agentName: string;
  status: 'success' | 'error';
  errorDetails?: {
    message: string;
    code?: string;
    stack?: string;
  };
}

class SubmissionMonitor {
  private static instance: SubmissionMonitor;
  private logs: SubmissionLog[] = [];

  private constructor() {}

  static getInstance(): SubmissionMonitor {
    if (!SubmissionMonitor.instance) {
      SubmissionMonitor.instance = new SubmissionMonitor();
    }
    return SubmissionMonitor.instance;
  }

  logSuccess(data: TransactionFormData, transactionId: string): void {
    const log: SubmissionLog = {
      timestamp: new Date().toISOString(),
      transactionId,
      mlsNumber: data.propertyData.mlsNumber,
      address: data.propertyData.address,
      agentName: data.signatureData.listingAgent || data.signatureData.buyersAgent,
      status: 'success'
    };

    this.logs.push(log);
    console.log('[Submission Monitor] Success:', log);
  }

  logError(data: TransactionFormData, error: Error, transactionId: string): void {
    const log: SubmissionLog = {
      timestamp: new Date().toISOString(),
      transactionId,
      mlsNumber: data.propertyData?.mlsNumber || 'N/A',
      address: data.propertyData?.address || 'N/A',
      agentName: data.signatureData?.listingAgent || data.signatureData?.buyersAgent || 'N/A',
      status: 'error',
      errorDetails: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      }
    };

    this.logs.push(log);
    console.error('[Submission Monitor] Error:', log);
  }

  getRecentLogs(count: number = 10): SubmissionLog[] {
    return this.logs.slice(-count);
  }

  getErrorLogs(): SubmissionLog[] {
    return this.logs.filter(log => log.status === 'error');
  }

  getSuccessRate(): number {
    if (this.logs.length === 0) return 0;
    const successCount = this.logs.filter(log => log.status === 'success').length;
    return (successCount / this.logs.length) * 100;
  }
}

export const submissionMonitor = SubmissionMonitor.getInstance();