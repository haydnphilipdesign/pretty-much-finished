#!/bin/bash

echo "Running Transaction Flow Test..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed or not in the PATH"
  echo "Please install Node.js and try again"
  exit 1
fi

# Create test output directory if it doesn't exist
mkdir -p test-output

# Install required dependencies 
echo "Installing required dependencies..."
npm install --save-dev dotenv pdf-lib node-fetch@2 express body-parser

echo ""
echo "Starting test..."
echo ""

# Run the test script
node scripts/test-transaction-flow.js

# Check for test output
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "Test failed with error code: $EXIT_CODE"
  echo "Check the console output above for details"
  exit $EXIT_CODE
else
  echo ""
  echo "Test completed successfully!"
  echo "Check the test-output directory for results"
fi
