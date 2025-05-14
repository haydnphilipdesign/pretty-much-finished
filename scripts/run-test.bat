@echo off
echo Running Transaction Flow Test...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed or not in the PATH
  echo Please install Node.js and try again
  exit /b 1
)

REM Create test output directory if it doesn't exist
if not exist "test-output" mkdir "test-output"

REM Install required dependencies if needed
echo Checking dependencies...
call npm install --save-dev dotenv pdf-lib node-fetch@2 express body-parser

echo.
echo Starting test...
echo.

REM Run the test script
node scripts/test-transaction-flow.js

REM Check for test output
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Test failed with error code: %ERRORLEVEL%
  echo Check the console output above for details
  exit /b %ERRORLEVEL%
) else (
  echo.
  echo Test completed successfully!
  echo Check the test-output directory for results
)
