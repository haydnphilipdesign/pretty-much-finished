# Supabase PDF Upload Setup Guide

## 1. Create Supabase Storage Bucket

1. Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project (the one matching the URL in your .env file)
3. Navigate to the 'Storage' section in the left sidebar
4. Click 'New Bucket'
5. Enter the bucket name: `transaction-documents`
6. Enable 'Public bucket' option to allow public access to the files
7. Click 'Create bucket'

## 2. Configure Bucket Permissions

1. After creating the bucket, click on the bucket name to open its settings
2. Go to the 'Policies' tab
3. Create the following policies:

   ### For anonymous users (public access):
   - Policy name: `Public Read Access`
   - Allowed operation: `SELECT`
   - Policy definition: `true` (allows anyone to read files)

   ### For authenticated users (upload access):
   - Policy name: `Service Role Upload Access`
   - Allowed operation: `INSERT`
   - Policy definition: `true` (allows service role to upload files)

## 3. Testing the PDF Upload Functionality

### Option 1: Using the API directly

1. Create a test PDF file
2. Convert the PDF to base64 (you can use online tools or the following command):
   ```
   node -e "console.log(Buffer.from(require('fs').readFileSync('test.pdf')).toString('base64'))"
   ```
3. Use a tool like Postman or curl to make a POST request to your API endpoint:
   ```
   curl -X POST https://your-app-url.com/api/supabase-pdf-upload \
     -H "Content-Type: application/json" \
     -d '{"pdfData":"<base64-data>", "transactionId":"<airtable-record-id>", "filename":"test.pdf"}'
   ```

### Option 2: Testing from your application

1. Modify your form submission code to use the new Supabase PDF upload endpoint:
   ```javascript
   // Example code for form submission with PDF upload
   const handleSubmit = async (formData) => {
     // ... other form processing code
     
     // If there's a PDF file in the form
     if (pdfFile) {
       const reader = new FileReader();
       reader.onload = async () => {
         const base64Data = reader.result.split(',')[1]; // Remove data URL prefix
         
         // Upload PDF to Supabase and get URL for Airtable
         const response = await fetch('/api/supabase-pdf-upload', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             pdfData: base64Data,
             transactionId: createdRecordId, // ID from Airtable record creation
             filename: pdfFile.name
           }),
         });
         
         const result = await response.json();
         console.log('PDF upload result:', result);
       };
       reader.readAsDataURL(pdfFile);
     }
   };
   ```

## 4. Troubleshooting

### Common Issues:

1. **CORS Errors**: If you encounter CORS issues, make sure your Supabase project has the correct CORS configuration in the API settings.

2. **Authentication Errors**: Verify that your SUPABASE_URL and SUPABASE_ANON_KEY environment variables are correctly set.

3. **Storage Permission Errors**: Check the bucket policies to ensure they allow the operations you're trying to perform.

4. **File Size Limits**: Supabase has a default file size limit of 50MB. For larger files, consider implementing chunked uploads or compression.

5. **Airtable Integration Issues**: Verify that the Airtable API key and base ID are correct, and that the field ID for PDF attachments matches your Airtable base structure.

If you encounter any issues, check the server logs for detailed error messages that can help identify the problem.
