/**
 * Formats a date from yyyy-mm-dd to mm/dd/yyyy format
 * @param dateString - The date string to format
 * @returns The formatted date or original string if not a valid date
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '';

  // Check if it's already in mm/dd/yyyy format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }

  // Try to parse the date (assuming yyyy-mm-dd format)
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
  }

  // Return original if we couldn't format it
  return dateString;
}

/**
 * Check if a date is valid and within a specified range
 * @param dateString - The date string to validate
 * @param maxDaysInFuture - Maximum number of days in the future (default: 90)
 * @returns Whether the date is valid and within range
 */
export function isValidDate(dateString?: string, maxDaysInFuture: number = 90): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false;
    }
    
    // Get today's date (resetting to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate max date
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDaysInFuture);
    
    // Check if date is within range
    return date >= today && date <= maxDate;
  } catch (e) {
    console.error("Error validating date:", e);
    return false;
  }
} 