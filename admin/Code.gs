/**
 * CUOnline Attendance System - Admin Backend
 * Google Apps Script Code
 * Version 1.0.0
 * 
 * This script handles:
 * - Roster management
 * - Attendance data storage
 * - CR panel API endpoints
 * - Admin approval workflow
 */

// ═════════════════════════════════════════════════════════════════
// CONFIGURATION - UPDATE THESE VALUES
// ═════════════════════════════════════════════════════════════════

const CONFIG = {
  SPREADSHEET_ID: 'PASTE_YOUR_SHEET_ID_HERE',
  ROSTER_SHEET: 'Roster',
  ATTENDANCE_SHEET: 'Attendance',
  ADMIN_LOG_SHEET: 'AdminLog',
  ADMIN_EMAIL: 'admin@comsats.edu.pk'
};

// ═════════════════════════════════════════════════════════════════
// MAIN REQUEST HANDLER
// ═════════════════════════════════════════════════════════════════

function doGet(e) {
  try {
    const action = e.parameter.action || 'admin';
    
    if (action === 'admin') {
      return HtmlService.createHtmlOutput(getAdminPanel());
    } else if (action === 'api') {
      return handleApiRequest(e);
    }
    
    return HtmlService.createHtmlOutput('Invalid action');
  } catch (error) {
    return HtmlService.createHtmlOutput(`Error: ${error.toString()}`);
  }
}

function doPost(e) {
  try {
    const action = e.parameter.action || 'unknown';
    const data = e.postData.contents ? JSON.parse(e.postData.contents) : {};
    
    if (action === 'uploadRoster') {
      return ContentService.createTextOutput(
        JSON.stringify(handleRosterUpload(data))
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'submitAttendance') {
      return ContentService.createTextOutput(
        JSON.stringify(handleAttendanceSubmission(data))
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'approveAttendance') {
      return ContentService.createTextOutput(
        JSON.stringify(handleApproval(data, 'approved'))
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'rejectAttendance') {
      return ContentService.createTextOutput(
        JSON.stringify(handleApproval(data, 'rejected'))
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'exportData') {
      return ContentService.createTextOutput(
        JSON.stringify(handleDataExport(data))
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: 'Unknown action' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ═════════════════════════════════════════════════════════════════
// ROSTER MANAGEMENT
// ═════════════════════════════════════════════════════════════════

function handleRosterUpload(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ROSTER_SHEET);
    
    // Clear existing data (keep header)
    if (sheet.getMaxRows() > 1) {
      sheet.deleteRows(2, sheet.getMaxRows() - 1);
    }
    
    // Prepare rows
    const rows = [];
    data.students.forEach((student, index) => {
      rows.push([
        student.regNo,
        student.name,
        student.section,
        student.course || '',
        new Date(),
        'active'
      ]);
    });
    
    // Add header if not exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Registration No', 'Name', 'Section', 'Course', 'Added Date', 'Status']);
    }
    
    // Append data
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, 6).setValues(rows);
    }
    
    logAction('Roster Uploaded', `${rows.length} students added`, data.course);
    
    return {
      status: 'success',
      message: `${rows.length} students uploaded successfully`,
      count: rows.length
    };
  } catch (error) {
    logAction('Roster Upload Failed', error.toString());
    return { status: 'error', message: error.toString() };
  }
}

function getRoster(course, section) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ROSTER_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const roster = [];
    for (let i = 1; i < data.length; i++) {
      if (!course || data[i][3] === course) {
        if (!section || data[i][2] === section) {
          roster.push({
            regNo: data[i][0],
            name: data[i][1],
            section: data[i][2],
            course: data[i][3],
            status: data[i][5]
          });
        }
      }
    }
    
    return roster;
  } catch (error) {
    Logger.log('Error getting roster: ' + error);
    return [];
  }
}

// ═════════════════════════════════════════════════════════════════
// ATTENDANCE MANAGEMENT
// ═════════════════════════════════════════════════════════════════

function handleAttendanceSubmission(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
    
    // Add header if not exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Date', 'Course', 'Section', 'CR Email', 'Present Count',
        'Absent Count', 'Roster JSON', 'Attendance JSON', 'Status',
        'Submitted Date', 'Notes'
      ]);
    }
    
    // Count present and absent
    const attendance = data.attendance || {};
    let presentCount = 0, absentCount = 0;
    
    Object.values(attendance).forEach(status => {
      if (status === 'P') presentCount++;
      else if (status === 'A') absentCount++;
    });
    
    // Add attendance record
    sheet.appendRow([
      data.date,
      data.course,
      data.section,
      data.crEmail || 'unknown@comsats.edu.pk',
      presentCount,
      absentCount,
      JSON.stringify(data.roster || []),
      JSON.stringify(data.attendance || {}),
      'pending',
      new Date(),
      data.notes || ''
    ]);
    
    logAction(
      'Attendance Submitted',
      `${data.course}-${data.section}: ${presentCount}P, ${absentCount}A`,
      data.course
    );
    
    return {
      status: 'success',
      message: 'Attendance submitted successfully',
      presentCount,
      absentCount,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logAction('Attendance Submission Failed', error.toString());
    return { status: 'error', message: error.toString() };
  }
}

function getSubmissions(status, dateFilter) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const submissions = [];
    for (let i = 1; i < data.length; i++) {
      if (!status || data[i][8] === status) {
        if (!dateFilter || data[i][0] === dateFilter) {
          submissions.push({
            date: data[i][0],
            course: data[i][1],
            section: data[i][2],
            crEmail: data[i][3],
            presentCount: data[i][4],
            absentCount: data[i][5],
            status: data[i][8],
            submittedDate: data[i][9],
            notes: data[i][10]
          });
        }
      }
    }
    
    return submissions;
  } catch (error) {
    Logger.log('Error getting submissions: ' + error);
    return [];
  }
}

function handleApproval(data, approvalStatus) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
    const values = sheet.getDataRange().getValues();
    
    // Find and update the matching record
    for (let i = 1; i < values.length; i++) {
      if (
        values[i][0] === data.date &&
        values[i][1] === data.course &&
        values[i][2] === data.section
      ) {
        sheet.getRange(i + 1, 9).setValue(approvalStatus); // Status column
        if (data.notes) {
          sheet.getRange(i + 1, 11).setValue(data.notes); // Notes column
        }
        
        logAction(
          `Attendance ${approvalStatus}`,
          `${data.course}-${data.section} on ${data.date}`,
          data.course
        );
        
        return {
          status: 'success',
          message: `Attendance ${approvalStatus} successfully`,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return { status: 'error', message: 'Attendance record not found' };
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// ═════════════════════════════════════════════════════════════════
// API REQUEST HANDLER
// ═════════════════════════════════════════════════════════════════

function handleApiRequest(e) {
  try {
    const type = e.parameter.type;
    
    if (type === 'getRoster') {
      const course = e.parameter.course;
      const section = e.parameter.section;
      const roster = getRoster(course, section);
      
      return ContentService.createTextOutput(
        JSON.stringify({
          status: 'success',
          data: roster,
          count: roster.length
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else if (type === 'getSubmissions') {
      const status = e.parameter.status;
      const date = e.parameter.date;
      const submissions = getSubmissions(status, date);
      
      return ContentService.createTextOutput(
        JSON.stringify({
          status: 'success',
          submissions,
          count: submissions.length
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: 'Unknown API type' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ═════════════════════════════════════════════════════════════════
// DATA EXPORT
// ═════════════════════════════════════════════════════════════════

function handleDataExport(data) {
  try {
    const format = data.format || 'json';
    const type = data.type || 'attendance';
    
    if (type === 'roster') {
      const roster = getRoster();
      return { status: 'success', format, data: roster };
    } else if (type === 'attendance') {
      const submissions = getSubmissions();
      return { status: 'success', format, data: submissions };
    }
    
    return { status: 'error', message: 'Unknown export type' };
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}

// ═════════════════════════════════════════════════════════════════
// LOGGING & AUDIT TRAIL
// ═════════════════════════════════════════════════════════════════

function logAction(action, details, course = '') {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.ADMIN_LOG_SHEET);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Action', 'Details', 'Course', 'User']);
    }
    
    sheet.appendRow([
      new Date(),
      action,
      details,
      course,
      Session.getActiveUser().getEmail()
    ]);
  } catch (error) {
    Logger.log('Logging error: ' + error);
  }
}

// ═════════════════════════════════════════════════════════════════
// HTML PANEL
// ═════════════════════════════════════════════════════════════════

function getAdminPanel() {
  return HtmlService.createHtmlOutput(
    `<!DOCTYPE html>
<html>
<head>
  <title>CUOnline Admin Backend</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔧 CUOnline Admin Backend</h1>
    <p>Backend is running and configured.</p>
    
    <div class="status success">
      ✓ Google Apps Script Backend Active
    </div>
    
    <p><strong>Configuration Status:</strong></p>
    <ul>
      <li>Spreadsheet ID: ${CONFIG.SPREADSHEET_ID ? '✓ Set' : '✗ Not set'}</li>
      <li>Admin Email: ${CONFIG.ADMIN_EMAIL}</li>
      <li>Roster Sheet: ${CONFIG.ROSTER_SHEET}</li>
      <li>Attendance Sheet: ${CONFIG.ATTENDANCE_SHEET}</li>
    </ul>
    
    <hr>
    <p><strong>API Endpoints Available:</strong></p>
    <ul>
      <li>GET - Get Roster: ?action=api&type=getRoster</li>
      <li>GET - Get Submissions: ?action=api&type=getSubmissions</li>
      <li>POST - Submit Attendance: action=submitAttendance</li>
      <li>POST - Approve Attendance: action=approveAttendance</li>
      <li>POST - Export Data: action=exportData</li>
    </ul>
    
    <hr>
    <p><small>For Admin Panel interface, use the Admin Panel deployment URL.</small></p>
  </div>
</body>
</html>`
  );
}