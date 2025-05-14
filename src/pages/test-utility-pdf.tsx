import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { generateTestPdf } from '../api/test-utility-pdf';

export default function TestUtilityPdf() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState('LISTING AGENT');
  const [sendEmail, setSendEmail] = useState(false);

  const handleGeneratePdf = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Call the API function directly
      const data = await generateTestPdf({
        role,
        sendEmail,
      });

      setResult(data);

      // Open the PDF in a new tab
      if (data.pdfPath) {
        window.open(data.pdfPath, '_blank');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Utility Sheet PDF Generation</CardTitle>
          <CardDescription>
            Generate a test utility sheet PDF with sample data to verify the implementation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Agent Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select agent role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LISTING AGENT">Listing Agent</SelectItem>
                <SelectItem value="BUYER'S AGENT">Buyer's Agent</SelectItem>
                <SelectItem value="DUAL AGENT">Dual Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked === true)}
            />
            <Label htmlFor="sendEmail">Send email to debbie@parealestatesupport.com</Label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">
              <p><strong>Success!</strong> PDF generated successfully.</p>
              {result.emailSent && <p>Email sent successfully.</p>}
              {result.emailError && <p>Email error: {result.emailError}</p>}
              <p>
                <a
                  href={result.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View PDF
                </a>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGeneratePdf} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Test PDF'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
