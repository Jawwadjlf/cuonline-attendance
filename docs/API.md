# 🔌 API Reference

Complete API documentation for CUOnline Attendance System.

## Base URL

```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/userweb
```

## Endpoints

### 1. Get Roster

**Endpoint**: `GET /userweb?action=api&type=getRoster`

**Parameters**:
| Parameter | Type | Required | Example |
|-----------|------|----------|----------|
| action | String | Yes | "api" |
| type | String | Yes | "getRoster" |
| course | String | Optional | "CSC462" |
| section | String | Optional | "A" |

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "regNo": "FA22-BCS-008",
      "name": "AQSA HANIF",
      "section": "A",
      "course": "CSC462"
    }
  ],
  "count": 25
}
```

### 2. Get Submissions

**Endpoint**: `GET /userweb?action=api&type=getSubmissions`

**Parameters**:
| Parameter | Type | Required | Example |
|-----------|------|----------|----------|
| action | String | Yes | "api" |
| type | String | Yes | "getSubmissions" |
| status | String | Optional | "pending" |
| date | String | Optional | "2026-02-06" |

**Response**:
```json
{
  "status": "success",
  "submissions": [
    {
      "date": "2026-02-06",
      "course": "CSC462",
      "section": "A",
      "crEmail": "cr@example.com",
      "presentCount": 23,
      "absentCount": 2,
      "status": "pending",
      "submittedDate": "2026-02-06T09:15:00Z"
    }
  ]
}
```

### 3. Submit Attendance (CR Panel)

**Endpoint**: `POST /userweb?action=submitAttendance`

**Body** (JSON):
```json
{
  "course": "CSC462",
  "section": "A",
  "date": "2026-02-06",
  "time": "09:00-10:20",
  "roster": [
    {
      "regNo": "FA22-BCS-008",
      "name": "AQSA HANIF",
      "section": "A",
      "course": "CSC462"
    }
  ],
  "attendance": {
    "FA22-BCS-008": "P",
    "FA22-BCS-078": "P",
    "SP23-BCS-006": "A"
  },
  "notes": "Class covered lectures on AI algorithms"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Attendance submitted successfully",
  "id": "ATT_20260206_CSC462_A",
  "timestamp": "2026-02-06T09:30:00Z"
}
```

### 4. Approve Attendance (Admin)

**Endpoint**: `POST /userweb?action=approveAttendance`

**Body** (JSON):
```json
{
  "date": "2026-02-06",
  "course": "CSC462",
  "section": "A",
  "notes": "Approved by admin"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Attendance approved",
  "timestamp": "2026-02-06T10:00:00Z"
}
```

### 5. Reject Attendance (Admin)

**Endpoint**: `POST /userweb?action=rejectAttendance`

**Body** (JSON):
```json
{
  "date": "2026-02-06",
  "course": "CSC462",
  "section": "A",
  "reason": "Missing lecture notes"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Attendance rejected",
  "timestamp": "2026-02-06T10:05:00Z"
}
```

### 6. Export Data

**Endpoint**: `GET /userweb?action=exportData&format=csv`

**Parameters**:
| Parameter | Type | Required | Values |
|-----------|------|----------|--------|
| action | String | Yes | "exportData" |
| format | String | Yes | "csv" or "json" |
| type | String | Optional | "roster" or "attendance" |
| dateFrom | String | Optional | "2026-01-01" |
| dateTo | String | Optional | "2026-02-28" |

**Response** (CSV):
```
Registration No,Name,Section,Course,Date,Status
FA22-BCS-008,AQSA HANIF,A,CSC462,2026-02-06,Present
FA22-BCS-078,MUHAMMAD SALMAN,A,CSC462,2026-02-06,Present
```

**Response** (JSON):
```json
{
  "status": "success",
  "format": "json",
  "data": [
    {
      "regNo": "FA22-BCS-008",
      "name": "AQSA HANIF",
      "section": "A",
      "course": "CSC462",
      "date": "2026-02-06",
      "status": "Present"
    }
  ],
  "count": 100
}
```

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

### Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| INVALID_PARAMS | Missing required parameters | Check parameter names and types |
| SHEET_NOT_FOUND | Google Sheet ID invalid | Verify Sheet ID in Code.gs |
| UNAUTHORIZED | User not authenticated | Sign in with correct account |
| INVALID_ROSTER | Roster data corrupted | Re-upload roster |
| DUPLICATE_SUBMISSION | Attendance already submitted | Check for duplicate submissions |
| INVALID_FORMAT | Request format incorrect | Use JSON format for POST requests |

## Authentication

**Admin Panel**: Requires Google sign-in
```javascript
GoogleAuth.login() // Built into Admin Panel
```

**CR Panel**: QR code validation (no login required)
```javascript
// QR contains embedded roster and session info
```

## Rate Limits

- **Read requests**: 500 per minute per user
- **Write requests**: 100 per minute per user
- **File operations**: 20 per minute per user

## Examples

### JavaScript (Fetch API)

**Get Roster**:
```javascript
fetch('https://script.google.com/macros/s/[ID]/userweb?action=api&type=getRoster&course=CSC462')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Submit Attendance**:
```javascript
fetch('https://script.google.com/macros/s/[ID]/userweb?action=submitAttendance', {
  method: 'POST',
  body: JSON.stringify(attendanceData)
})
  .then(r => r.json())
  .then(data => console.log(data));
```

### Python

```python
import requests
import json

BASE_URL = 'https://script.google.com/macros/s/[ID]/userweb'

# Get roster
response = requests.get(f'{BASE_URL}?action=api&type=getRoster&course=CSC462')
roster = response.json()
print(roster)

# Submit attendance
data = {
    'course': 'CSC462',
    'section': 'A',
    'date': '2026-02-06',
    'attendance': {'FA22-BCS-008': 'P'}
}
response = requests.post(f'{BASE_URL}?action=submitAttendance', json=data)
print(response.json())
```

## Webhooks (Future)

Planned for future versions:
- POST to external webhook on attendance submission
- Real-time notifications
- Email confirmations

---

**Last Updated**: February 2026
**API Version**: 1.0