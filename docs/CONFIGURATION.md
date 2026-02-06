# 🔧 Configuration Guide

Complete setup instructions for CUOnline Attendance System.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ New** → **Spreadsheet**
3. Name it: `CUOnline Attendance Database`
4. Get the **Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   Copy the part between `/d/` and `/edit`

5. Create three sheets by clicking the **+** at bottom:
   - **Roster** (for student list)
   - **Attendance** (for submissions)
   - **AdminLog** (for audit trail)

## Step 2: Set Up Admin Backend

### Create Google Apps Script Project

1. Go to [Google Apps Script Console](https://script.google.com/home)
2. Click **New Project**
3. Name it: `CUOnline Admin Backend`
4. In the editor:
   - Click **+ Code** → **New File**
   - Choose type: **Apps Script**
   - Replace contents with [Code.gs](../admin/Code.gs)
   - Update CONFIG section:
     ```javascript
     const CONFIG = {
       SPREADSHEET_ID: 'YOUR_SHEET_ID_HERE',  // Paste Sheet ID
       ROSTER_SHEET: 'Roster',
       ATTENDANCE_SHEET: 'Attendance',
       ADMIN_LOG_SHEET: 'AdminLog',
       ADMIN_EMAIL: 'admin@comsats.edu.pk'    // Your email
     };
     ```

5. Create HTML file for frontend:
   - Click **+ Code** → **New File**
   - Choose type: **HTML**
   - Name it: `AdminPanel`
   - Paste contents from [AdminPanel.html](../admin/AdminPanel.html)

6. **Deploy as Web App**:
   - Click **Deploy** dropdown (top right)
   - Select **New Deployment**
   - Type: **Web App**
   - Execute as: **Me (your email)**
   - Who has access: **Anyone**
   - Click **Deploy**
   - **Copy the deployment URL**
   - Save it somewhere safe!

### Find Your Script IDs

**Script ID:**
- Click ⚙️ **Settings** (top right)
- Copy "Script ID"

**Deployment ID:**
- From Deploy dropdown, find the active deployment
- Copy the ID

## Step 3: Set Up CR Panel

### Create Another Google Apps Script Project

1. Go to [Google Apps Script Console](https://script.google.com/home)
2. Click **New Project**
3. Name it: `CUOnline CR Panel`
4. Create HTML file:
   - Click **+ Code** → **New File**
   - Type: **HTML**
   - Name: `CRPanel`
   - Paste contents from [CRPanel.html](../cr/CRPanel.html)

5. In CRPanel.html, find this line (around line 200):
   ```javascript
   const BACKEND_URL = 'https://script.google.com/macros/s/ADMIN_SCRIPT_ID/userweb';
   ```
   Replace `ADMIN_SCRIPT_ID` with your **Admin Script ID**

6. **Deploy as Web App**:
   - Deploy → New Deployment → Web App
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the deployment URL

## Step 4: Store Configuration

Create a file `docs/deployment-config.json` (in your GitHub repo) with:

```json
{
  "googleSheet": {
    "sheetId": "YOUR_SHEET_ID_HERE",
    "rosterSheet": "Roster",
    "attendanceSheet": "Attendance",
    "adminLogSheet": "AdminLog"
  },
  "adminBackend": {
    "scriptId": "YOUR_ADMIN_SCRIPT_ID_HERE",
    "deploymentId": "YOUR_ADMIN_DEPLOYMENT_ID_HERE",
    "webAppUrl": "https://script.google.com/macros/s/YOUR_ADMIN_DEPLOYMENT_ID_HERE/userweb"
  },
  "crPanel": {
    "scriptId": "YOUR_CR_SCRIPT_ID_HERE",
    "deploymentId": "YOUR_CR_DEPLOYMENT_ID_HERE",
    "webAppUrl": "https://script.google.com/macros/s/YOUR_CR_DEPLOYMENT_ID_HERE/userweb"
  },
  "adminEmail": "admin@comsats.edu.pk"
}
```

**⚠️ IMPORTANT**: Never commit this to GitHub! Add to `.gitignore`

## Step 5: Verify Setup

### Test Admin Backend
1. Open Admin Panel URL in browser
2. You should see the admin dashboard
3. Try uploading a test roster (CSV format)
4. Generate a QR code

### Test CR Panel
1. Open CR Panel URL in browser
2. Try scanning the generated QR code
3. Mark some students present/absent
4. Submit attendance
5. Check Admin Panel "Received Attendance" tab

## Step 6: Share with Users

### For Class Representatives
Share the **CR Panel URL**:
```
https://script.google.com/macros/s/[CR_DEPLOYMENT_ID]/userweb
```

### For Admins
Share the **Admin Panel URL**:
```
https://script.google.com/macros/s/[ADMIN_DEPLOYMENT_ID]/userweb
```

## Troubleshooting

### "Script doesn't exist" error
- Verify deployment ID in URL is correct
- Check deployment is still active (Deploy dropdown)
- Try redeploying

### "Sheet not found" error
- Check Sheet ID in `Code.gs`
- Verify sheet names are exactly: "Roster", "Attendance"
- Ensure you have access to the sheet

### "Permission denied" error
- Sign in with correct Google account
- Verify email in CONFIG matches your account
- Check sheet sharing permissions

### QR code not scanning
- Clear browser cache (Ctrl+Shift+Delete)
- Try different QR code generator
- Check camera permissions in browser

## Next Steps

1. ✅ Test the system with real roster
2. ✅ Create attendance for a test class
3. ✅ Collect feedback from CRs
4. ✅ Make adjustments as needed
5. ✅ Roll out to all departments

---

**Need help?** Check [API.md](API.md) or [DEPLOYMENT.md](DEPLOYMENT.md)