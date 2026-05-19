# Recruiter Dashboard Guide

## Overview

The **Find Employee / Hire Top Talent** recruiter dashboard is a fully functional, database-driven system that displays real students who have purchased and completed courses from your website.

## What Data is Shown?

The dashboard displays students who have:

✅ **Purchased courses** from your website (via Razorpay payment)  
✅ **Active or completed enrollment** status  
✅ **Course progress** tracking (0-100%)  
✅ **Certificates** for completed courses  
✅ **Student details**: Name, email, phone, education, skills  

## Features

### 📊 Overview Stats
- Total Students
- Available Students (not yet placed)
- Already Placed Students
- Shortlisted Students

### 🔍 Search & Filters
- **Search**: By name, email, skills, or course
- **Filters**: 
  - Skills (React, Node.js, Python, Java, AWS)
  - Course (Full Stack, Data Science, DevOps, ML)
  - Education (B.Tech, M.Tech, B.Sc, MBA)
  - Availability (All, Available, Placed)

### 👥 Student Cards
Each student card shows:
- Name, avatar, and availability status
- Course enrolled in
- Education level
- Skills (derived from courses)
- Projects count and certificates count
- Rating and reviews
- Placement info (if already placed)

### 🎯 Action Buttons
- **View Profile**: See detailed student information
- **Download CV**: Download student's uploaded CV
- **Shortlist**: Add/remove student from your shortlist
- **Post Job**: Create job postings (modal)

### 📈 Placement Highlights
- Total placed students
- Average package
- Top hiring companies
- Recent placements

## How Students Appear in Dashboard

### Step 1: Student Purchases Course
When a student completes payment via Razorpay:
1. Payment record is created in `Payment` collection
2. Enrollment record is created in `Enrollment` collection
3. Progress record is initialized in `Progress` collection
4. Student's `purchasedCourses` array is updated

### Step 2: Student Completes Course
As the student progresses:
1. `Progress` collection tracks completed lessons
2. `progressPercent` is updated (0-100%)
3. When 100% complete, `isCompleted` is set to true
4. Certificate is generated in `Certificate` collection

### Step 3: Student Appears in Dashboard
The recruiter dashboard API (`/api/recruiter/students`) fetches:
- All students with role `STUDENT`
- Who have at least one enrollment
- With status `active` or `completed`
- Enriched with progress, certificates, and placement data

## Database Collections Used

### 1. AuthUser
Stores student account information:
- Name, email, phone
- Role (STUDENT)
- Selected program (education level)
- Account status (approved)

### 2. Enrollment
Tracks course purchases:
- userId, courseSlug, courseName
- Payment details (paymentId, amountPaid)
- Enrollment status (active, completed)
- Enrolled date and completion date

### 3. Progress
Tracks course completion:
- userId, courseSlug
- Completed lessons array
- Progress percentage (0-100)
- Total lessons count
- Completion status and date

### 4. Certificate
Stores issued certificates:
- userId, courseSlug
- Certificate ID (e.g., ADYP-2024-XXXXXX)
- Student name, course name
- Issue date and status

### 5. Payment
Records all payments:
- Payment ID, order ID
- Course details
- Amount (base + GST)
- Payment status and method

## Testing with Sample Data

If you don't have real students yet, you can seed test data:

### Option 1: Run Seed Script

```bash
# Install dependencies if needed
npm install

# Run the seed script
npx ts-node scripts/seed-student-data.ts
```

This will create:
- 10 sample students
- Random course enrollments (1-3 courses per student)
- Progress tracking (10-100% completion)
- Certificates for completed courses
- Payment records

**Default password for test students**: `Test@123`

### Option 2: Manual Testing

1. **Create a student account**:
   - Go to signup page
   - Register as a STUDENT
   - Email: `test.student@example.com`
   - Password: `Test@123`

2. **Purchase a course**:
   - Browse courses
   - Select a plan (Starter, Standard, Professional, Career Pro)
   - Complete payment via Razorpay (use test mode)

3. **Complete some lessons**:
   - Go to student dashboard
   - Open enrolled course
   - Mark lessons as complete
   - Progress will be tracked automatically

4. **View in recruiter dashboard**:
   - Login as COMPANY or ADMIN
   - Go to "Find Employee" page
   - Student will appear with their progress

## API Endpoints

### GET /api/recruiter/students
Fetches all enrolled students with filters.

**Query Parameters**:
- `search` - Search by name, email, skills
- `skill` - Filter by skill
- `course` - Filter by course name
- `education` - Filter by education level
- `availability` - Filter by availability (available/placed/all)
- `page` - Pagination page number
- `limit` - Results per page

**Response**:
```json
{
  "success": true,
  "students": [
    {
      "id": "user_id",
      "name": "Student Name",
      "email": "student@example.com",
      "phone": "9876543210",
      "education": "B.Tech",
      "courseName": "Adyapan Career Pro",
      "courseSlug": "plan-4-premium",
      "progressPercent": 75,
      "isCompleted": false,
      "certificateCount": 2,
      "skills": ["React", "Node.js", "MongoDB"],
      "projectsCount": 3,
      "rating": 4.8,
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

### GET /api/recruiter/overview
Returns dashboard statistics.

**Response**:
```json
{
  "success": true,
  "overview": {
    "totalStudents": 50,
    "availableStudents": 35,
    "placedStudents": 15,
    "shortlistedStudents": 8
  }
}
```

### POST /api/recruiter/shortlist
Add student to shortlist.

**Body**:
```json
{
  "studentId": "user_id",
  "courseSlug": "plan-4-premium",
  "courseName": "Adyapan Career Pro"
}
```

### DELETE /api/recruiter/shortlist/:studentId
Remove student from shortlist.

### GET /api/recruiter/students/:id/cv
Download student's CV.

**Response**:
```json
{
  "success": true,
  "cv": {
    "fileUrl": "https://storage.example.com/cv.pdf",
    "fileName": "student_cv.pdf",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/recruiter/placements
Get placement statistics and highlights.

**Response**:
```json
{
  "success": true,
  "placements": {
    "totalPlaced": 15,
    "avgPackage": 650000,
    "topCompanies": [
      { "name": "TCS", "count": 5 },
      { "name": "Infosys", "count": 3 }
    ],
    "recentPlacements": [
      {
        "studentName": "John Doe",
        "companyName": "TCS",
        "packageAmount": 700000
      }
    ]
  }
}
```

## Access Control

### Who Can Access?
- ✅ **COMPANY** role users
- ✅ **ADMIN** role users
- ✅ **SUPERADMIN** role users
- ❌ **STUDENT** role users (blocked)

### Security Layers
1. **Frontend**: "For Recruiter" button hidden from students
2. **Middleware**: `/company/*` routes protected
3. **API**: Role validation on all recruiter endpoints

## Troubleshooting

### "No students found" message

**Possible reasons**:

1. **No students have purchased courses yet**
   - Solution: Use the seed script or have students purchase courses

2. **Filters are too restrictive**
   - Solution: Click "Reset" button to clear all filters

3. **Database connection issue**
   - Solution: Check MongoDB connection in `.env` file
   - Verify `MONGODB_URI` is correct

4. **Students exist but not enrolled**
   - Solution: Students must complete payment to create enrollment
   - Check `Enrollment` collection in database

### Verify Data in Database

```bash
# Connect to MongoDB
mongosh "your_mongodb_uri"

# Check students
db.authusers.find({ role: "STUDENT" }).count()

# Check enrollments
db.enrollments.find({ enrollmentStatus: { $in: ["active", "completed"] } }).count()

# Check progress
db.progresses.find().count()

# Check certificates
db.certificates.find({ status: "ready" }).count()
```

### API Not Returning Data

1. **Check API response**:
   ```bash
   curl http://localhost:3000/api/recruiter/students
   ```

2. **Check browser console** for errors

3. **Verify authentication**:
   - Make sure you're logged in as COMPANY/ADMIN
   - Check JWT token in cookies

4. **Check server logs** for errors

## Next Steps

### Enhancements You Can Add

1. **CV Upload Feature**
   - Add CV upload in student profile
   - Store in cloud storage (AWS S3, Cloudinary)
   - Link to `StudentCV` model

2. **Advanced Filters**
   - Location-based filtering
   - Salary expectations
   - Work experience
   - Internship completion

3. **Bulk Actions**
   - Bulk shortlist/remove
   - Export to CSV/Excel
   - Send bulk emails

4. **Job Posting System**
   - Complete job posting form
   - Job listing page
   - Application tracking

5. **Analytics Dashboard**
   - Hiring trends
   - Course popularity
   - Placement success rate
   - Time-to-hire metrics

6. **Communication Features**
   - In-app messaging
   - Interview scheduling
   - Email templates
   - WhatsApp integration

## Support

For issues or questions:
1. Check this guide first
2. Review API documentation
3. Check database collections
4. Verify authentication and roles
5. Test with seed data

---

**Last Updated**: May 8, 2026  
**Version**: 1.0.0
