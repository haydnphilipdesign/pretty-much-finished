/**
 * Utility script to check email service configuration
 */
require('dotenv').config();
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

async function checkNodemailerConfiguration() {
  console.log('\n--- Checking Nodemailer Configuration ---');
  
  // Check required environment variables
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];
  const missingVars = requiredVars.filter(name => !process.env[name]);
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Please check your .env file and ensure all required variables are set.');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  
  // Create transporter
  try {
    console.log('Creating nodemailer transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
    
    // Verify connection
    console.log('Verifying connection to mail server...');
    await transporter.verify();
    console.log('✅ Connection to mail server successful');
    
    return true;
  } catch (error) {
    console.error('❌ Nodemailer configuration failed:', error.message);
    console.log('Error details:', error);
    return false;
  }
}

async function checkResendConfiguration() {
  console.log('\n--- Checking Resend Configuration ---');
  
  // Check API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
    console.log('Please check your .env file and ensure the Resend API key is set.');
    return false;
  }
  
  console.log('✅ Resend API key is set');
  
  // Verify API key by checking account info
  try {
    console.log('Verifying Resend API key...');
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Resend API check failed: ${response.status} - ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Resend API key verified successfully');
    console.log(`Available domains: ${data.data.length > 0 ? data.data.map(d => d.name).join(', ') : 'None'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Resend API check failed:', error.message);
    console.log('Error details:', error);
    return false;
  }
}

async function sendTestEmail() {
  console.log('\n--- Sending Test Email ---');
  
  // Import email service
  const emailService = require('../api/email-service');
  
  // Email options
  const emailOptions = {
    to: process.env.EMAIL_RECIPIENT || 'debbie@parealestatesupport.com',
    subject: 'Test Email from PA Real Estate Support Services',
    html: `
      <h1>Test Email</h1>
      <p>This is a test email sent from the email-service-check.js script.</p>
      <p>If you're receiving this email, the email service is working correctly.</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `
  };
  
  try {
    console.log('Sending test email...');
    const result = await emailService.sendEmail(emailOptions);
    
    if (result.success) {
      console.log(`✅ Test email sent successfully using ${result.provider} provider`);
      return true;
    } else {
      console.error(`❌ Failed to send test email: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    console.log('Error details:', error);
    return false;
  }
}

async function main() {
  console.log('=== Email Service Configuration Check ===');
  console.log('Checking email configuration for PA Real Estate Support Services');
  console.log('Current environment:', process.env.NODE_ENV || 'development');
  
  // Check Nodemailer
  const nodemailerOk = await checkNodemailerConfiguration();
  
  // Check Resend
  const resendOk = await checkResendConfiguration();
  
  // Summary
  console.log('\n=== Email Service Summary ===');
  console.log(`Nodemailer: ${nodemailerOk ? '✅ Working' : '❌ Not working'}`);
  console.log(`Resend API: ${resendOk ? '✅ Working' : '❌ Not working'}`);
  
  if (nodemailerOk || resendOk) {
    console.log('\nAt least one email service is available.');
    
    // Only send test email if at least one service is available
    const sendTestPrompt = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    sendTestPrompt.question('Do you want to send a test email? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        await sendTestEmail();
      }
      
      console.log('\nCheck complete. You can use these results to diagnose email service issues.');
      process.exit(0);
    });
  } else {
    console.error('\n❌ No email services are available. Please check your configuration.');
    process.exit(1);
  }
}

// Run the check
main().catch(error => {
  console.error('Error running email service check:', error);
  process.exit(1);
});