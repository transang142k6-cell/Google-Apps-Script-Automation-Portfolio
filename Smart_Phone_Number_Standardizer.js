/**
 * Cleans and standardizes phone numbers. Supports both single cells and bulk ranges (ArrayFormula).
 * * Usage: 
 * 1. Single Cell: =CLEAN_PHONE_NUMBER(A2)
 * 2. Bulk Range:  =CLEAN_PHONE_NUMBER(A2:A100) -> Much faster for large datasets!
 * * @param {string|Array<Array<string>>} input The cell or range containing phone numbers.
 * @param {string} [defaultCountryCode="+84"] Optional: Default country code (e.g., "+1", "+84"). Defaults to "+84".
 * @return {string|Array<Array<string>>} The standardized phone number(s).
 * @customfunction
 */
function CLEAN_PHONE_NUMBER(input, defaultCountryCode) {
  // Set default country code if not provided
  var countryCode = defaultCountryCode || "+84";

  // 1. ARRAY PROCESSING (The "Pro" Feature)
  // Check if 'input' is a Range (Array of Arrays). If yes, process recursively.
  if (Array.isArray(input)) {
    return input.map(function(row) {
      return row.map(function(cell) {
        return CLEAN_PHONE_NUMBER(cell, countryCode);
      });
    });
  }

  // 2. INPUT VALIDATION & TYPE SAFETY
  // Handle empty cells or null values gracefully
  if (input === "" || input === null || input === undefined) {
    return "";
  }
  
  // Force conversion to String (in case input is a raw number like 912345678)
  var rawString = String(input).trim();

  // 3. CORE CLEANING LOGIC (Regex)
  // Remove all characters except digits (0-9) and the plus sign (+)
  var cleaned = rawString.replace(/[^\d+]/g, '');

  // 4. STANDARDIZATION LOGIC
  // Case A: Starts with '0' (Domestic format) -> Replace with Country Code
  if (cleaned.startsWith('0')) {
    cleaned = countryCode + cleaned.substring(1);
  }
  // Case B: No '+' sign but legitimate length -> Prepend Country Code
  else if (!cleaned.startsWith('+') && cleaned.length > 7) {
    cleaned = countryCode + cleaned;
  }
  
  // Case C: Already has '+' -> Keep as is (International format)

  return cleaned;
}
