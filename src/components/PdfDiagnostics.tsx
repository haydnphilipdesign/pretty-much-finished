import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader, CheckCircle, XCircle, AlertTriangle, RefreshCw, Info, Download } from 'lucide-react';
import { getPdfSystemStatus, checkPdfGenerationApi } from '@/utils/pdfService.improved';
import logger from '@/utils/logger';

const log = logger.createLogger('PDF_DIAGNOSTICS');

/**
 * Component to display PDF generation diagnostics
 */
const PdfDiagnostics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('system');
  const [logs, setLogs] = useState<any[]>([]);

  // Get system status on mount
  useEffect(() => {
    checkStatus();
    
    // Get current logs
    setLogs(logger.getStoredLogs().filter(log => 
      log.context === 'PDF_SERVICE' || 
      log.context === 'PDF_DIAGNOSTICS'
    ));
    
    // Configure logger to store more logs
    logger.configureLogger({
      maxStoredLogs: 500,
      minLevel: logger.LogLevel.DEBUG
    });
    
    log.info('PDF Diagnostics component mounted');
  }, []);

  // Function to check system status
  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    log.info('Checking PDF system status...');
    
    try {
      // Check system status
      const status = await getPdfSystemStatus();
      setSystemStatus(status);
      log.info('System status retrieved:', status);
      
      // Check API status
      const api = await checkPdfGenerationApi();
      setApiStatus(api);
      log.info('API status retrieved:', api);
      
      // Update logs
      setLogs(logger.getStoredLogs().filter(log => 
        log.context === 'PDF_SERVICE' || 
        log.context === 'PDF_DIAGNOSTICS'
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      log.error('Error checking status:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to download logs
  const downloadLogs = () => {
    log.info('Downloading logs...');
    logger.downloadLogs();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>PDF Generation Diagnostics</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkStatus} 
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Troubleshoot issues with PDF generation and email delivery
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="system" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="api">API Status</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : systemStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* API Status */}
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <h3 className="text-sm font-medium">API Access</h3>
                      {systemStatus.apiAccessible ? (
                        <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 ml-2 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {systemStatus.apiAccessible 
                        ? 'API endpoint is accessible' 
                        : 'API endpoint is not accessible'}
                    </p>
                  </div>
                  
                  {/* Template Status */}
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <h3 className="text-sm font-medium">Template Access</h3>
                      {systemStatus.templateAccessible ? (
                        <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 ml-2 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {systemStatus.templateAccessible 
                        ? 'PDF template is accessible' 
                        : 'PDF template is not accessible'}
                    </p>
                  </div>
                  
                  {/* Email Status */}
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center mb-2">
                      <h3 className="text-sm font-medium">Email Service</h3>
                      {systemStatus.emailWorking ? (
                        <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 ml-2 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {systemStatus.emailWorking 
                        ? 'Email service is configured' 
                        : 'Email service is not configured'}
                    </p>
                  </div>
                </div>
                
                {/* Details */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Details</h3>
                  <pre className="p-4 text-xs bg-gray-100 rounded-md overflow-auto max-h-64">
                    {JSON.stringify(systemStatus.details, null, 2)}
                  </pre>
                </div>
                
                {/* Recommendations */}
                {!systemStatus.apiAccessible || !systemStatus.templateAccessible || !systemStatus.emailWorking ? (
                  <Alert variant="warning" className="mt-4">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Recommendations</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {!systemStatus.apiAccessible && (
                          <li>Check network connectivity to the API endpoint</li>
                        )}
                        {!systemStatus.templateAccessible && (
                          <>
                            <li>Ensure the PDF template is accessible in the public directory</li>
                            <li>Configure the PDF_TEMPLATE_URL or PDF_TEMPLATE_BASE64 environment variable</li>
                          </>
                        )}
                        {!systemStatus.emailWorking && (
                          <li>Check email service configuration in environment variables</li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No status information available. Click Refresh to check status.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="api" className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : apiStatus ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">API Test Result</h3>
                  {apiStatus.success ? (
                    <Badge variant="success" className="ml-2">Success</Badge>
                  ) : (
                    <Badge variant="destructive" className="ml-2">Failed</Badge>
                  )}
                </div>
                
                <p className="text-sm">{apiStatus.message}</p>
                
                {/* Details */}
                {apiStatus.details && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Response Details</h4>
                    <pre className="p-4 text-xs bg-gray-100 rounded-md overflow-auto max-h-64">
                      {JSON.stringify(apiStatus.details, null, 2)}
                    </pre>
                  </div>
                )}
                
                {/* Recommendations */}
                {!apiStatus.success && (
                  <Alert variant="warning" className="mt-4">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Recommendations</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Check if the API endpoint is accessible</li>
                        <li>Verify authentication is configured correctly</li>
                        <li>Check server logs for detailed error information</li>
                        <li>Try redeploying the API</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No API status information available. Click Refresh to check status.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="mt-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">PDF Service Logs</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadLogs}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Logs
              </Button>
            </div>
            
            {logs.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                        Time
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                        Level
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                        Context
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <Badge 
                            variant={
                              log.level === 'ERROR' || log.level === 'FATAL' 
                                ? 'destructive' 
                                : log.level === 'WARN' 
                                  ? 'warning'
                                  : log.level === 'INFO'
                                    ? 'default'
                                    : 'secondary'
                            }
                          >
                            {log.level}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500">
                          {log.context}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500 truncate max-w-xs">
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No logs available. Perform some actions to generate logs.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-xs text-gray-500 flex items-center">
          <Info className="w-4 h-4 mr-1" />
          Use this tool to diagnose PDF generation and email delivery issues
        </div>
      </CardFooter>
    </Card>
  );
};

export default PdfDiagnostics;