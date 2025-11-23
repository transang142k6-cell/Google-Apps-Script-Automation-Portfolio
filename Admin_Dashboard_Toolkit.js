/**
 * Admin Dashboard Toolkit
 * Adds a custom menu to the Google Sheet UI for enhanced user experience and data management.
 * * Features:
 * 1. Safe Data Reset (with Confirmation Dialog).
 * 2. Sheet Visibility Toggle (Hide/Show 'Config' sheets to protect backend data).
 */

// 1. TRIGGER: Runs automatically when the Spreadsheet is opened.
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  // Create a custom menu named "⚡ Admin Tools"
  ui.createMenu('⚡ Admin Tools')
      .addItem('🗑️ Reset Dashboard Data', 'resetDashboardData')
      .addSeparator() // Adds a visual line divider
      .addItem('👁️ Hide System Sheets', 'hideSystemSheets')
      .addItem('vn Show System Sheets', 'showSystemSheets')
      .addToUi();
}

/**
 * Feature 1: Safely clears data from the main dashboard.
 * Includes a UI Alert to prevent accidental deletion.
 */
function resetDashboardData() {
  var ui = SpreadsheetApp.getUi();
  
  // A. CONFIRMATION DIALOG (User Experience Best Practice)
  var response = ui.alert(
    'Confirm Reset',
    'Are you sure you want to clear all data in the "Report Data" sheet? This cannot be undone.',
    ui.ButtonSet.YES_NO
  );

  // If user clicked "NO" or closed the dialog, stop the script.
  if (response !== ui.Button.YES) {
    ui.alert('Action Cancelled.');
    return;
  }

  // B. EXECUTE CLEAR ACTION
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report Data");
  
  if (sheet) {
    // Clear content from Row 2 downwards (Preserve Headers in Row 1)
    // getLastRow() check ensures we don't error if sheet is empty
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
      
      // Toast Notification (Small popup at bottom right)
      spreadsheet.toast("Dashboard data has been reset successfully.", "Success", 3000);
    } else {
      ui.alert("Sheet is already empty.");
    }
  } else {
    ui.alert("Error: 'Report Data' sheet not found.");
  }
}

/**
 * Feature 2: Hides the 'Config' sheet to prevent unauthorized edits.
 */
function hideSystemSheets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
  if (sheet) {
    sheet.hideSheet();
    SpreadsheetApp.getActiveSpreadsheet().toast("Config sheet is now hidden.", "Security Mode");
  }
}

/**
 * Feature 3: Unhides the 'Config' sheet for admin maintenance.
 */
function showSystemSheets() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
  if (sheet) {
    sheet.showSheet();
    SpreadsheetApp.getActiveSpreadsheet().activate(); // Set focus back to spreadsheet
    SpreadsheetApp.getActiveSpreadsheet().toast("Config sheet is now visible.", "Maintenance Mode");
  }
}
