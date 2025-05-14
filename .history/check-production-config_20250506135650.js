/**
 * Production Configuration Check Tool
 * 
 * This script tests the API endpoints in production to verify they're properly configured.
 */

// Import required modules
import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables
config();

// Configuration
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://pa-real-estate-support-services-r0nmj40jo.vercel.app';
const TEST_ENDPOINTS = [
    '/api/generate-pdf',
    '/api/supabase-pdf-upload',
    '/api/update-airtable-attachment'
];

/**
 * Test if an endpoint returns the expected response type
 */
async function testEndpoint(endpoint) {
    const url = `${PRODUCTION_URL}${endpoint}`;
    console.log(`Testing endpoint: ${url}`);

    try {
        // Send OPTIONS request first to check CORS and availability
        const optionsResponse = await fetch(url, { method: 'OPTIONS' });
        console.log(`OPTIONS status: ${optionsResponse.status}`);
        console.log(`OPTIONS headers: ${JSON.stringify([...optionsResponse.headers.entries()])}`);

        // Now send actual request (using POST since these are likely POST endpoints)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                test: true
            })
        });

        // Get response details
        const status = response.status;
        const contentType = response.headers.get('content-type') || '';

        // Try to get response body
        let body;
        try {
            if (contentType.includes('application/json')) {
                body = await response.json();
            } else {
                body = await response.text();
                // If it looks like HTML, truncate to first 500 chars
                if (body.includes('<html>')) {
                    body = `HTML CONTENT (first 500 chars): ${body.substring(0, 500)}...`;
                }
            }
        } catch (parseError) {
            body = `[Error parsing response: ${parseError.message}]`;
        }

        // Log results
        console.log(`Status: ${status}`);
        console.log(`Content-Type: ${contentType}`);
        console.log(`Response: ${JSON.stringify(body, null, 2)}`);

        // Check if it's configured correctly
        const isConfiguredCorrectly =
            (status !== 404) &&
            !contentType.includes('text/html');

        console.log(`✅ Configured correctly: ${isConfiguredCorrectly}`);
        console.log('-----------------------------------');

        return {
            endpoint,
            status,
            contentType,
            isConfiguredCorrectly
        };
    } catch (error) {
        console.error(`Error testing ${endpoint}:`, error);
        console.log('-----------------------------------');

        return {
            endpoint,
            error: error.message,
            isConfiguredCorrectly: false
        };
    }
}

/**
 * Run tests for all endpoints
 */
async function runTests() {
    console.log(`🔍 CHECKING PRODUCTION CONFIGURATION AT ${PRODUCTION_URL}`);
    console.log('===================================================');

    const results = await Promise.all(TEST_ENDPOINTS.map(testEndpoint));

    // Summary
    console.log('\n📊 SUMMARY:');
    const allCorrect = results.every(r => r.isConfiguredCorrectly);

    results.forEach(result => {
        const icon = result.isConfiguredCorrectly ? '✅' : '❌';
        console.log(`${icon} ${result.endpoint}`);
    });

    console.log('\n🏁 OVERALL STATUS:');
    console.log(allCorrect ?
        '✅ All endpoints appear to be configured correctly' :
        '❌ Some endpoints are not configured correctly');

    // Recommendations if problems found
    if (!allCorrect) {
        console.log('\n🔧 RECOMMENDATIONS:');
        console.log('1. Verify your vercel.json routes configuration');
        console.log('2. Check .vercelignore to ensure required files are not excluded');
        console.log('3. Confirm API endpoints are in the correct location (api/ folder)');
        console.log('4. Review Vercel build logs for any deployment errors');
        console.log('5. Test locally using "vercel dev" command to simulate production');
    }
}

// Run the tests
runTests();