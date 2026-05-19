# Database Setup Guide for Recruiter Dashboard

## 🎯 Goal
Show real data from your MongoDB database in the recruiter dashboard.

---

## Step 1: Check Your Current Database

Run this command to see what data you currently have:

```bash
node scripts/check-database-data.js
```

This will show you:
- ✅ How many students exist
- ✅ How many enrollments
- ✅ How many placements
- ✅ How many company users
- ✅ Whether the dashboard will show data

**Example Output:**
```
📊 RECRUITER DASHBOARD DATA SUMMARY:
═══════════════════════════════════════════════════════

  📚 Total Enrolled Students: 25
  ✅ Available Students: 20
  💼 Placed Students: 5
  ⭐ Total Shortlists: 3
  📄 Students with CVs: 10
  💼 Active Jobs: 2
```

---

## Step 2: Add Sample Data (If Needed)

If you don't have enough data, run this to add sample students:

```bash
node scripts/seed-sample-data.js
```

This will create:
- ✅ 5 sample students
- ✅ 5 enrollments (one per student)
- ✅ 5 progress records
- ✅ 2 certificates (for completed students)
- ✅ 2 placements (students who got jobs)
- ✅ 1 company user (recruiter account)

**Sample Recruiter Login:**
- Email: `recruiter@adyapan.com`
- Password: `recruiter123`

---

## Step 3: Access the Recruiter Dashboard

### Option A: Use Existing Company User

If you already have a COMPANY, ADMIN, or SUPERADMIN user:

1. Login with your credentials
2. Navigate to: `http://localhost:3000/company/find-employee`
3. You should see the enrolled students!

### Option B: Use Sample Recruiter Account

If you ran the seed script:

1. Login with:
   - Email: `recruiter@adyapan.com`
   - Password: `recruiter123`
2. Navigate to: `http://localhost:3000/company/find-employee`
3. You should see 5 sample students!

---

## Step 4: Verify Data is Showing

The dashboard should display:

### Overview Cards
- **Total Students**: Number of enrolled students
- **Available**: Students not yet placed
- **Already Placed**: Students with job placements
- **Shortlisted**: Students you've shortlisted

### Student Cards
Each card shows:
- ✅ Student name and avatar
- ✅ Course name
- ✅ Education
- ✅ Skills (derived from courses)
- ✅ Projects count
- ✅ Certificates count
- ✅ Rating
- ✅ Availability status
- ✅ Placement info (if placed)
- ✅ Action buttons

### Placement Highlights (Right Sidebar)
- Total placed students
- Average package
- Top hiring companies

---

## Troubleshooting

### Problem: "No students found"

**Cause:** No students have enrolled in courses yet.

**Solution:**
```bash
# Check if enrollments exist
node scripts/check-database-data.js

# If no enrollments, seed sample data
node scripts/seed-sample-data.js
```

### Problem: "Forbidden - insufficient permissions"

**Cause:** You're logged in as a STUDENT user.

**Solution:**
- Logout and login as COMPANY, ADMIN, or SUPERADMIN
- Or use the sample recruiter account: `recruiter@adyapan.com`

### Problem: "Unauthorized"

**Cause:** Not logged in or token expired.

**Solution:**
- Login again
- Check if JWT_SECRET is set in .env
- Clear cookies and login again

### Problem: Dashboard loads but shows 0 students

**Cause:** Students exist but haven't enrolled in courses.

**Solution:**
Students must have enrollments to appear in the recruiter dashboard. Check:

```bash
node scripts/check-database-data.js
```

Look for "Total Enrolled Students". If it's 0, students need to:
1. Purchase a course
2. Complete payment
3. Get enrolled

Or run the seed script to add sample enrolled students.

---

## Understanding the Data Flow

### For Students to Appear in Dashboard:

1. **User Account** (authusers collection)
   - role: 'STUDENT'
   - accountStatus: 'approved'
   - isActive: true

2. **Enrollment** (enrollments collection)
   - enrollmentStatus: 'active' or 'completed'
   - Links student to a course

3. **Progress** (progresses collection)
   - Shows course completion percentage
   - Used to calculate projects count

4. **Certificates** (certificates collection)
   - Shows completed courses
   - Displayed in student cards

5. **Placement** (placements collection) - Optional
   - If exists: student shows as "Placed"
   - Shows company name and package
   - If not exists: student shows as "Available"

---

## Adding Real Students

To add real students (not sample data):

### Method 1: Through Student Registration

1. Students register on your platform
2. Students purchase a course
3. Payment is processed
4. Enrollment is created automatically
5. Student appears in recruiter dashboard

### Method 2: Manual Database Entry

```javascript
// 1. Create user
db.authusers.insertOne({
  name: "Student Name",
  email: "student@example.com",
  role: "STUDENT",
  accountStatus: "approved",
  isActive: true,
  passwordHash: "...", // bcrypt hash
  // ... other fields
});

// 2. Create enrollment
db.enrollments.insertOne({
  userId: "USER_ID_FROM_ABOVE",
  courseSlug: "full-stack-development",
  courseName: "Full Stack Development",
  enrollmentStatus: "active",
  paymentId: "pay_XXXXX",
  // ... other fields
});

// 3. Student now appears in dashboard!
```

---

## Database Collections Reference

### Required for Dashboard:
- ✅ `authusers` - User accounts
- ✅ `enrollments` - Course enrollments (REQUIRED)

### Optional but Recommended:
- `certificates` - Shows certificates count
- `progresses` - Shows course progress
- `placements` - Shows placement status
- `studentcvs` - Enables CV download
- `recruitershortlists` - Tracks shortlisted students

### Created by Dashboard:
- `recruiteractivitylogs` - Logs all recruiter actions
- `cvdownloadlogs` - Tracks CV downloads
- `recruiterjobs` - Job postings

---

## Quick Commands Reference

```bash
# Check database data
node scripts/check-database-data.js

# Add sample data
node scripts/seed-sample-data.js

# Start development server
npm run dev

# Access dashboard
# http://localhost:3000/company/find-employee
```

---

## Sample Data Details

If you run the seed script, you'll get:

### Students:
1. **Aarohi Sharma** - Full Stack Development (Placed at Tech Mahindra)
2. **Rohit Verma** - Data Science (Placed at Infosys)
3. **Priya Mehta** - Machine Learning & AI (Available)
4. **Karan Joshi** - DevOps Engineering (Available)
5. **Sneha Reddy** - Android Development (Available)

### Recruiter Account:
- Email: `recruiter@adyapan.com`
- Password: `recruiter123`
- Role: COMPANY

---

## Next Steps After Setup

Once data is showing:

1. **Test Search**
   - Search for student names
   - Search for skills
   - Search for courses

2. **Test Filters**
   - Filter by skills
   - Filter by course
   - Filter by education
   - Filter by availability

3. **Test Actions**
   - View student profiles
   - Shortlist students
   - Download CVs (if uploaded)
   - Post a job

4. **Test Tabs**
   - All Students
   - Shortlisted
   - Placed

---

## Production Checklist

Before going live:

- [ ] Remove sample data
- [ ] Add real students with enrollments
- [ ] Configure CV upload for students
- [ ] Set up file storage (AWS S3, Cloudinary)
- [ ] Configure email notifications
- [ ] Set proper JWT_SECRET in production
- [ ] Enable MongoDB authentication
- [ ] Set up database backups
- [ ] Configure proper CORS settings
- [ ] Add rate limiting to APIs
- [ ] Set up error monitoring (Sentry, etc.)

---

## Support

If you're still having issues:

1. Check MongoDB is running: `mongosh`
2. Check connection string in `.env`
3. Check browser console for errors
4. Check server logs for API errors
5. Run the check script to verify data

**Need help?** Check the error messages in:
- Browser console (F12)
- Server terminal
- MongoDB logs

---

## Success! 🎉

If you see students in the dashboard, you're all set! The recruiter dashboard is now showing real data from your MongoDB database.

**Happy Recruiting!** 🚀
