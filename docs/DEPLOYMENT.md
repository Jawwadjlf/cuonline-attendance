# 🚀 Complete Deployment Guide

**CUOnline Attendance System - Final Deployment**

---

## Prerequisites

✅ Google Account  
✅ GitHub Account  
✅ Modern Web Browser (Chrome, Firefox, Safari)  
✅ Basic understanding of Google Apps Script

---

## Part 1: Google Sheet Setup

### Step 1.1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ New Spreadsheet**
3. Name it: **`CUOnline Attendance Database`**
4. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
5. Save this Sheet ID - you'll need it!

### Step 1.2: Create Required Sheets

1. Click the **+** button at the bottom
2. Add three sheets with these exact names:
   - **Roster** (for student list)
   - **Attendance** (for submissions)
   - **AdminLog** (for audit trail)

### Step 1.3: Add Headers

**In "Roster" sheet**, Row 1:
```
Registration No | Name | Section | Course | Added Date | Status
```

**In "Attendance" sheet**, Row 1:
```
Date | Course | Section | CR Email | Present Count | Absent Count | Roster JSON | Attendance JSON | Status | Submitted Date | Notes
```

**In "AdminLog" sheet**, Row 1:
```
Timestamp | Action | Details | Course | User
```

---

## Part 2: Deploy Admin Backend

### Step 2.1: Create Google Apps Script Project

1. Go to [Google Apps Script Console](https://script.google.com/home)
2. Click **New Project**
3. Name it: **`CUOnline Admin Backend`**
4. In the editor, you'll see `Code.gs` file

### Step 2.2: Add Backend Code

1. Replace the existing code in `Code.gs` with contents from:
   ```
   admin/Code.gs
   ```
   (Copy from GitHub repo)

2. **UPDATE THE CONFIG SECTION** (Line 15-22):
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'PASTE_YOUR_SHEET_ID_HERE',  // ← Paste your Sheet ID
     ROSTER_SHEET: 'Roster',
     ATTENDANCE_SHEET: 'Attendance',
     ADMIN_LOG_SHEET: 'AdminLog',
     ADMIN_EMAIL: 'YOUR_EMAIL@comsats.edu.pk'     // ← Update email
   };
   ```

### Step 2.3: Add HTML Panel

1. Click **+ Add** → **New File**
2. Choose **HTML** type
3. Name it: **`AdminPanel`**
4. Paste contents from:
   ```
   admin/AdminPanel.html
   ```
   (Copy from GitHub repo)

### Step 2.4: Deploy as Web App

1. Click **Deploy** dropdown (top right)
2. Select **New Deployment**
3. Choose **Web App**
4. Set:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy and save the deployment URL**:
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/userweb
   ```

### Step 2.5: Get Script IDs

1. Click **⚙️ Settings** (top right)
2. Copy **Script ID** - save this!

---

## Part 3: Deploy CR Panel

### Step 3.1: Create Second Google Apps Script Project

1. Go to [Google Apps Script Console](https://script.google.com/home)
2. Click **New Project**
3. Name it: **`CUOnline CR Panel`**

### Step 3.2: Add CR Panel HTML

1. Click **+ Add** → **New File**
2. Choose **HTML** type
3. Name it: **`CRPanel`**
4. Paste contents from:
   ```
   cr/CRPanel.html
   ```
   (Copy from GitHub repo)

### Step 3.3: Update Backend URL

In the CRPanel.html file, find this line (around line 200):
```javascript
const CONFIG = {
  BACKEND_URL: 'https://script.google.com/macros/s/YOUR_ADMIN_SCRIPT_ID/userweb'
};
```

Replace `YOUR_ADMIN_SCRIPT_ID` with your **Admin Script Deployment ID** from Part 2

### Step 3.4: Deploy CR Panel

1. Click **Deploy** → **New Deployment**
2. Choose **Web App**
3. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the CR Panel URL**:
   ```
   https://script.google.com/macros/s/[CR_DEPLOYMENT_ID]/userweb
   ```

---

## Part 4: Test the System

### Step 4.1: Test Admin Panel

1. Open the **Admin Panel URL** in browser
2. You should see:
   - ✅ Admin Panel header
   - ✅ Three tabs: "Manage Roster", "Generate QR", "Received Attendance"
   - ✅ Demo data loaded

3. Try:
   - Click "Load Demo Data"
   - Click "Generate QR Code"
   - See QR displayed

### Step 4.2: Test CR Panel

1. Open the **CR Panel URL** in browser
2. You should see:
   - ✅ CR Panel header
   - ✅ Three tabs: "Scan QR", "Manual Entry", "History"

3. Try:
   - Click "Manual Entry"
   - Fill in Course: CSC462, Section: A, Date: Today
   - Click "Load Session"
   - Mark some students Present/Absent
   - Click "Submit Attendance"
   - Should show success message

---

## Part 5: Production Deployment

### Step 5.1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Create new repository:
   - Name: **`cuonline-attendance`**
   - Description: **`CUOnline Attendance System with Admin Panel & CR Management`**
   - Public: Yes
   - Initialize with README: Yes

### Step 5.2: Upload Files to GitHub

Push these files to your repository:

```
cuonline-attendance/
├── admin/
│   ├── Code.gs
│   └── AdminPanel.html
├── cr/
│   └── CRPanel.html
├── docs/
│   ├── CONFIGURATION.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── README.md
├── LICENSE
└── .gitignore
```

### Step 5.3: Document Your Deployment

Create a file `docs/deployment-config.json` with your configuration:

```json
{
  "deployment_date": "2026-02-06",
  "google_sheet": {
    "sheet_id": "YOUR_SHEET_ID",
    "name": "CUOnline Attendance Database"
  },
  "admin_backend": {
    "script_id": "YOUR_ADMIN_SCRIPT_ID",
    "web_app_url": "https://script.google.com/macros/s/ADMIN_ID/userweb"
  },
  "cr_panel": {
    "script_id": "YOUR_CR_SCRIPT_ID",
    "web_app_url": "https://script.google.com/macros/s/CR_ID/userweb"
  },
  "admin_email": "admin@comsats.edu.pk"
}
```

**⚠️ WARNING**: Never commit this file! Add to `.gitignore`

---

## Part 6: Share with Users

### Admin Users

Share this URL:
```
https://script.google.com/macros/s/[ADMIN_DEPLOYMENT_ID]/userweb
```

### Class Representatives (CR)

Share this URL:
```
https://script.google.com/macros/s/[CR_DEPLOYMENT_ID]/userweb
```

Or create a QR code pointing to this URL for easy sharing.

---

## Part 7: Monitoring & Maintenance

### Weekly Tasks

- [ ] Check Admin Panel logs
- [ ] Verify attendance submissions
- [ ] Backup Google Sheet
- [ ] Review rejected submissions

### Monthly Tasks

- [ ] Review usage statistics
- [ ] Update rosters as needed
- [ ] Archive old attendance data
- [ ] Check system performance

### Important Links

| Item | URL |
|------|-----|
| **Google Sheet** | https://sheets.google.com/spreadsheets/d/YOUR_SHEET_ID/edit |
| **Admin GAS Project** | https://script.google.com/home (find "CUOnline Admin Backend") |
| **CR GAS Project** | https://script.google.com/home (find "CUOnline CR Panel") |
| **GitHub Repo** | https://github.com/YOUR_USERNAME/cuonline-attendance |

---

## Troubleshooting

### Issue: Admin Panel shows "Sheet not found"

**Solution**:
1. Check Sheet ID in `Code.gs` line 17
2. Verify sheet exists and you have access
3. Confirm sheet names: "Roster", "Attendance", "AdminLog"

### Issue: QR Code won't generate

**Solution**:
1. Make sure roster is loaded first
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try different browser
4. Check browser console for JS errors (F12)

### Issue: CR Panel won't connect to Admin

**Solution**:
1. Check CONFIG.BACKEND_URL in CRPanel.html
2. Verify Admin deployment is active
3. Check GAS logs: Apps Script → View logs

### Issue: Attendance not saving

**Solution**:
1. Verify Google Sheet permissions
2. Check Sheet ID in Code.gs
3. Review GAS execution logs
4. Ensure "Attendance" sheet exists

---

## Success Checklist

- [ ] Google Sheet created with 3 tabs
- [ ] Admin GAS project deployed with Code.gs
- [ ] Admin Panel HTML deployed
- [ ] CR GAS project deployed with CRPanel.html
- [ ] Both deployments are active and have URLs
- [ ] Admin Panel tested (roster upload, QR generation)
- [ ] CR Panel tested (manual entry, attendance marking)
- [ ] GitHub repo created with all files
- [ ] URLs shared with users
- [ ] System monitoring in place

---

## Support & Contact

📧 **Admin Email**: admin@comsats.edu.pk  
📱 **WhatsApp**: [Your Number]  
💬 **Discord**: [Your Server Link]  

---

**Deployment completed!** 🎉

**Version**: 1.0.0  
**Last Updated**: February 6, 2026  
**Status**: ✅ Production Ready