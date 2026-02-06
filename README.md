# 📱 CUOnline Attendance System

**Automated attendance management system** for COMSATS Institute of Information Technology with **Admin Control Center**, **CR Panel**, and **Google Apps Script Backend**.

## 🎯 Features

### Admin Panel
- ✅ **Manage Roster**: Upload CSV, add/remove students
- ✅ **Generate QR Codes**: Create session QR with embedded roster
- ✅ **Export Data**: JSON, CSV formats for backup
- ✅ **Receive Attendance**: Track submissions from CRs
- ✅ **Approve/Reject**: Quality control workflow
- ✅ **Analytics**: Department coverage, session stats

### CR Panel  
- 🔐 Scan QR codes with embedded session data
- ✅ Mark attendance (Present/Absent)
- 💾 Add lecture notes (optional)
- 📤 Submit to admin backend
- 📊 View submission history
- 🔄 Sync with cloud database

### Backend (Google Apps Script)
- 📝 REST API for roster management
- 💾 Cloud storage in Google Sheets
- 🔐 Admin authentication
- 📦 Data serialization & export
- ⚡ Real-time sync
- 📊 Audit trail

## 🚀 Quick Start

### Prerequisites
- Google Account
- GitHub Account
- Modern Web Browser

### Setup (5 minutes)

1. **Create Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create new sheet named "CUOnline Attendance Database"
   - Add sheets: "Roster" and "Attendance"
   - Copy Sheet ID from URL

2. **Deploy Admin Backend**
   - Open [Google Apps Script Console](https://script.google.com/home)
   - Create new project
   - Copy `Code.gs` and `AdminPanel.html` contents
   - Update CONFIG with your Sheet ID
   - Deploy as Web App (New Deployment → Web App)
   - Copy deployment URL

3. **Deploy CR Panel**
   - Create new GAS project
   - Copy `CRPanel.html` content
   - Update BACKEND_URL with Admin script URL
   - Deploy as Web App
   - Share CR Panel URL with class representatives

4. **Access Points**
   ```
   Admin:    https://script.google.com/macros/s/[ADMIN_ID]/userweb
   CR Panel: https://script.google.com/macros/s/[CR_ID]/userweb
   ```

## 📁 Repository Structure

```
cuonline-attendance/
├── admin/
│   ├── AdminPanel.html          # Admin UI
│   ├── Code.gs                  # GAS Backend
│   └── config.example.js        # Configuration template
├── cr/
│   ├── CRPanel.html             # CR UI
│   └── config.example.js        # Configuration template
├── docs/
│   ├── CONFIGURATION.md         # Setup guide
│   ├── API.md                   # API Reference
│   └── DEPLOYMENT.md            # Deployment guide
├── .gitignore
├── README.md
└── LICENSE
```

## 🔌 API Endpoints

### Admin Backend

**Get Roster**
```
GET /userweb?action=api&type=getRoster&course=CSC462&section=A
```

**Get Submissions**
```
GET /userweb?action=api&type=getSubmissions
```

**Submit Attendance**
```
POST /userweb?action=submitAttendance
Body: { course, section, date, roster, attendance, notes }
```

**Approve Attendance**
```
POST /userweb?action=approveAttendance
Body: { date, course, section, notes }
```

## 📊 Data Schema

### Roster Sheet
| Column | Field | Type | Example |
|--------|-------|------|----------|
| A | Registration No | String | FA22-BCS-008 |
| B | Name | String | AQSA HANIF |
| C | Section | String | A |
| D | Course | String | CSC462 |
| E | Added Date | Date | 2026-02-06 |
| F | Status | String | active |

### Attendance Sheet
| Column | Field | Type | Notes |
|--------|-------|------|-------|
| A | Date | Date | Session date |
| B | Course | String | Course code |
| C | Section | String | Section A/B/C |
| D | CR Email | String | Class rep email |
| E | Present Count | Number | Count |
| F | Absent Count | Number | Count |
| G | Roster JSON | Text | Full roster object |
| H | Attendance JSON | Text | Attendance data |
| I | Status | String | pending/approved/rejected |
| J | Submitted Date | Timestamp | Submission time |
| K | Notes | Text | Admin notes |

## 🔐 Security

- ✅ Admin panel requires Google authentication
- ✅ CR panel uses QR code validation
- ✅ All data stored in secure Google Sheets
- ✅ API endpoints require valid course/section
- ✅ Deployment IDs in environment variables (never commit)
- ✅ Audit trail for all admin actions

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 14+, Android 10+)

## 🛠️ Troubleshooting

### Admin panel won't load
- Check Sheet ID in `Code.gs`
- Verify GAS deployment URL
- Check browser console (F12) for errors

### Roster not uploading
- Ensure CSV format: Reg No, Name, Section
- Check Google Sheets permissions
- Verify Sheet name is exactly "Roster"

### QR code not generating
- Clear browser cache
- Ensure valid course and section
- Check roster has at least 1 student

### Attendance not submitting
- Verify CR Panel URL matches Admin backend URL
- Check Google Apps Script logs
- Ensure attendance data is valid JSON

## 📞 Support

**For Issues:**
1. Check [CONFIGURATION.md](docs/CONFIGURATION.md)
2. Review [API.md](docs/API.md)
3. Check Google Apps Script logs
4. Review browser console errors

**Contact:** admin@comsats.edu.pk

## 📄 License

MIT License - See LICENSE file for details

## 🎓 Educational Use

Developed for COMSATS Institute of Information Technology, Vehari Campus.

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintainer**: Your Team

---

**Ready to deploy?** Follow the [Quick Start](#quick-start) guide above! 🚀