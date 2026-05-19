# API Endpoints Testing Guide

## Quick Test Commands

Use these curl commands or Postman to test the API endpoints.

**Note:** Replace `YOUR_AUTH_TOKEN` with your actual JWT token.

---

## 1. Get Dashboard Overview

```bash
curl -X GET http://localhost:3000/api/recruiter/overview \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "overview": {
    "totalStudents": 50,
    "availableStudents": 35,
    "placedStudents": 15,
    "shortlistedStudents": 8,
    "recentActivity": 42
  }
}
```

---

## 2. Get Students List

```bash
# All students
curl -X GET http://localhost:3000/api/recruiter/students \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# With search
curl -X GET "http://localhost:3000/api/recruiter/students?search=john" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# With filters
curl -X GET "http://localhost:3000/api/recruiter/students?skill=React&course=Full%20Stack&availability=available" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "courseName": "Full Stack Development",
      "skills": ["React", "Node.js", "MongoDB"],
      "projectsCount": 5,
      "certificateCount": 3,
      "rating": 4.7,
      "availabilityStatus": "available",
      "isShortlisted": false,
      "placement": null
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 12,
    "pages": 5
  }
}
```

---

## 3. Get Student Profile

```bash
curl -X GET http://localhost:3000/api/recruiter/students/USER_ID \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "student": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "education": "B.Tech Computer Science",
    "enrollments": [...],
    "certificates": [...],
    "skills": ["React", "Node.js"],
    "projectsCount": 5,
    "totalCourses": 2,
    "totalCertificates": 3,
    "isShortlisted": false,
    "placement": null,
    "availabilityStatus": "available",
    "hasCV": true
  }
}
```

---

## 4. Download Student CV

```bash
curl -X GET http://localhost:3000/api/recruiter/students/USER_ID/cv \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "cv": {
    "fileName": "john_doe_cv.pdf",
    "fileUrl": "https://storage.example.com/cvs/john_doe_cv.pdf",
    "fileSize": 245678,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (No CV):**
```json
{
  "error": "CV not uploaded",
  "message": "This student has not uploaded their CV yet."
}
```

---

## 5. Add Student to Shortlist

```bash
curl -X POST http://localhost:3000/api/recruiter/shortlist \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "USER_ID",
    "courseSlug": "full-stack-development",
    "courseName": "Full Stack Development",
    "note": "Strong React skills"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student shortlisted successfully",
  "shortlist": {
    "_id": "shortlist123",
    "recruiterId": "recruiter456",
    "studentId": "user123",
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "courseSlug": "full-stack-development",
    "courseName": "Full Stack Development",
    "note": "Strong React skills",
    "createdAt": "2024-01-20T14:30:00Z"
  }
}
```

---

## 6. Get Shortlisted Students

```bash
curl -X GET http://localhost:3000/api/recruiter/shortlist \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "shortlists": [
    {
      "_id": "shortlist123",
      "studentId": "user123",
      "studentName": "John Doe",
      "studentEmail": "john@example.com",
      "courseName": "Full Stack Development",
      "note": "Strong React skills",
      "createdAt": "2024-01-20T14:30:00Z"
    }
  ],
  "count": 8
}
```

---

## 7. Remove from Shortlist

```bash
curl -X DELETE http://localhost:3000/api/recruiter/shortlist/USER_ID \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Removed from shortlist"
}
```

---

## 8. Get Placement Highlights

```bash
curl -X GET http://localhost:3000/api/recruiter/placements \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "placements": {
    "totalPlaced": 106,
    "avgPackage": 840000,
    "highestPackage": 1400000,
    "topCompanies": [
      { "name": "TCS", "count": 25 },
      { "name": "Infosys", "count": 20 },
      { "name": "Wipro", "count": 15 }
    ],
    "recentPlacements": [
      {
        "studentName": "Jane Smith",
        "companyName": "Google",
        "jobTitle": "Software Engineer",
        "packageAmount": 1200000,
        "joiningDate": "2024-02-01T00:00:00Z",
        "placementType": "full-time"
      }
    ]
  }
}
```

---

## 9. Create Job Posting

```bash
curl -X POST http://localhost:3000/api/recruiter/jobs \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Full Stack Developer",
    "description": "We are looking for an experienced Full Stack Developer...",
    "requiredSkills": ["React", "Node.js", "MongoDB"],
    "budget": 50000,
    "deadline": "2024-03-01T00:00:00Z",
    "jobType": "full-time",
    "status": "open"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "job": {
    "_id": "job123",
    "recruiterId": "recruiter456",
    "title": "Full Stack Developer",
    "description": "We are looking for...",
    "requiredSkills": ["React", "Node.js", "MongoDB"],
    "budget": 50000,
    "deadline": "2024-03-01T00:00:00Z",
    "jobType": "full-time",
    "status": "open",
    "applicants": [],
    "createdAt": "2024-01-20T15:00:00Z"
  }
}
```

---

## 10. Get Job Postings

```bash
# All jobs
curl -X GET http://localhost:3000/api/recruiter/jobs \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Only open jobs
curl -X GET "http://localhost:3000/api/recruiter/jobs?status=open" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "jobs": [
    {
      "_id": "job123",
      "title": "Full Stack Developer",
      "description": "We are looking for...",
      "requiredSkills": ["React", "Node.js"],
      "budget": 50000,
      "jobType": "full-time",
      "status": "open",
      "applicants": [],
      "createdAt": "2024-01-20T15:00:00Z"
    }
  ],
  "count": 5
}
```

---

## Testing with Postman

### 1. Create a Collection
- Name: "Recruiter Dashboard API"
- Base URL: `http://localhost:3000`

### 2. Set Authorization
- Type: Bearer Token
- Token: `YOUR_AUTH_TOKEN`

### 3. Add Requests
Create requests for each endpoint above.

### 4. Test Scenarios

#### Scenario 1: View Students
1. GET `/api/recruiter/overview`
2. GET `/api/recruiter/students`
3. GET `/api/recruiter/students/:id`

#### Scenario 2: Shortlist Student
1. GET `/api/recruiter/students`
2. POST `/api/recruiter/shortlist` (with studentId)
3. GET `/api/recruiter/shortlist`
4. DELETE `/api/recruiter/shortlist/:studentId`

#### Scenario 3: Download CV
1. GET `/api/recruiter/students/:id`
2. GET `/api/recruiter/students/:id/cv`

#### Scenario 4: Post Job
1. POST `/api/recruiter/jobs`
2. GET `/api/recruiter/jobs`

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied. Only COMPANY, ADMIN, or SUPERADMIN can access this resource."
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Database Queries to Verify

### Check if student is enrolled
```javascript
db.enrollments.find({ userId: "USER_ID", enrollmentStatus: { $in: ["active", "completed"] } })
```

### Check shortlist
```javascript
db.recruitershortlists.find({ recruiterId: "RECRUITER_ID", studentId: "USER_ID" })
```

### Check activity logs
```javascript
db.recruiteractivitylogs.find({ recruiterId: "RECRUITER_ID" }).sort({ createdAt: -1 }).limit(10)
```

### Check CV downloads
```javascript
db.cvdownloadlogs.find({ recruiterId: "RECRUITER_ID" }).sort({ downloadedAt: -1 })
```

### Check placements
```javascript
db.placements.find({ isVerified: true }).sort({ joiningDate: -1 })
```

---

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

TOKEN="YOUR_AUTH_TOKEN"
BASE_URL="http://localhost:3000"

echo "Testing Recruiter Dashboard API..."

echo "\n1. Overview"
curl -s -X GET "$BASE_URL/api/recruiter/overview" \
  -H "Authorization: Bearer $TOKEN" | jq

echo "\n2. Students List"
curl -s -X GET "$BASE_URL/api/recruiter/students?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

echo "\n3. Placements"
curl -s -X GET "$BASE_URL/api/recruiter/placements" \
  -H "Authorization: Bearer $TOKEN" | jq

echo "\nDone!"
```

Run with: `bash test-api.sh`

---

## Success Indicators

✅ All endpoints return 200 status
✅ Data matches database records
✅ Activity logs are created
✅ No package expectation in responses
✅ Placement info included when available
✅ Skills derived from courses
✅ Projects count accurate

---

## Troubleshooting

### "Unauthorized" error
- Check if token is valid
- Verify token format: `Bearer YOUR_TOKEN`
- Check token expiration

### "Forbidden" error
- Verify user role (must be COMPANY/ADMIN/SUPERADMIN)
- Check auth middleware

### Empty student list
- Verify students have enrollments
- Check enrollment status (active/completed)
- Verify MongoDB connection

### "CV not uploaded" error
- Student hasn't uploaded CV yet
- Check `studentcvs` collection
- Implement CV upload feature

---

**Happy Testing! 🧪**
