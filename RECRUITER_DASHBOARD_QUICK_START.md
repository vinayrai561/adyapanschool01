# Recruiter Dashboard - Quick Start Guide

## 🎯 What You Need to Know

The **Find Employee** page shows **real students** who have:
- ✅ Purchased courses from your website
- ✅ Completed or are actively taking courses
- ✅ Have progress tracking and certificates

## 🚀 Quick Start (3 Steps)

### Step 1: Check Current Data

Run this command to see what data you have:

```bash
npx ts-node scripts/test-recruiter-api.ts
```

This will show:
- How many students exist
- How many have purchased courses
- How many enrollments are active
- Sample student data

### Step 2: Add Test Data (If Needed)

If you see "No students found", create test data:

```bash
npx ts-node scripts/seed-student-data.ts
```

This creates:
- 10 sample students
- Random course enrollments
- Progress tracking (10-100%)
- Certificates for completed courses

**Default password**: `Test@123`

### Step 3: View Dashboard

1. Login as **COMPANY** or **ADMIN** user
2. Click **"For Recruiter"** button in navbar
3. Go to **"Find Employee"** page
4. You'll see all students with their:
   - Name, email, phone
   - Course enrolled in
   - Progress percentage
   - Skills and education
   - Certificates earned

## 📊 What Data is Shown?

### Student Information
- **Personal**: Name, email, phone, avatar
- **Education**: Degree/program (B.Tech, M.Tech, etc.)
- **Courses**: Enrolled courses with progress %
- **Skills**: Derived from course names
- **Certificates**: Count and details
- **Projects**: Count based on completed courses
- **Status**: Available or Already Placed

### Dashboard Features
- **Search**: By name, email, skills, course
- **Filters**: Skills, course, education, availability
- **Tabs**: All Students, Shortlisted, Placed
- **Actions**: View Profile, Download CV, Shortlist
- **Stats**: Total, Available, Placed, Shortlisted counts

## 🔍 How It Works

### When Student Purchases Course:
1. Student completes Razorpay payment
2. `Payment` record created
3. `Enrollment` record created
4. `Progress` record initialized
5. Student appears in recruiter dashboard

### When Student Completes Course:
1. Progress reaches 100%
2. `Certificate` is generated
3. Certificate count updates
4. Student shows as "Course Completed"

### When Recruiter Views Dashboard:
1. API fetches all students with enrollments
2. Enriches with progress, certificates, placements
3. Applies search and filters
4. Returns paginated results

## 🛠️ Troubleshooting

### "No students found"

**Check 1**: Do students exist?
```bash
npx ts-node scripts/test-recruiter-api.ts
```

**Check 2**: Are filters too restrictive?
- Click "Reset" button to clear filters
- Try searching without filters first

**Check 3**: Database connection?
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB is running

**Solution**: Run seed script
```bash
npx ts-node scripts/seed-student-data.ts
```

### Students exist but not showing

**Possible reasons**:
1. Students haven't purchased courses (no enrollments)
2. Enrollments are not "active" or "completed" status
3. Students are not approved or active
4. Wrong role (must be COMPANY/ADMIN to view)

**Solution**: Check database directly
```bash
mongosh "your_mongodb_uri"
db.enrollments.find().count()
db.authusers.find({ role: "STUDENT" }).count()
```

## 📁 Files Created

### Documentation
- `RECRUITER_DASHBOARD_GUIDE.md` - Complete guide
- `RECRUITER_DASHBOARD_QUICK_START.md` - This file

### Scripts
- `scripts/seed-student-data.ts` - Create test students
- `scripts/test-recruiter-api.ts` - Test API and data

### Updated Files
- `src/app/(student)/company/find-employee/page.tsx` - Better empty state

## 🎓 Sample Students Created

When you run the seed script, you get:

| Name | Email | Education | Courses |
|------|-------|-----------|---------|
| Rahul Sharma | rahul.sharma@example.com | B.Tech | 1-3 random |
| Priya Patel | priya.patel@example.com | M.Tech | 1-3 random |
| Amit Kumar | amit.kumar@example.com | B.Sc | 1-3 random |
| Sneha Reddy | sneha.reddy@example.com | MCA | 1-3 random |
| Vikram Singh | vikram.singh@example.com | B.Tech | 1-3 random |
| Anjali Gupta | anjali.gupta@example.com | MBA | 1-3 random |
| Rohan Verma | rohan.verma@example.com | BCA | 1-3 random |
| Kavya Iyer | kavya.iyer@example.com | B.Tech | 1-3 random |
| Arjun Nair | arjun.nair@example.com | M.Tech | 1-3 random |
| Divya Menon | divya.menon@example.com | B.Sc | 1-3 random |

All with password: `Test@123`

## 🔐 Access Control

### Who Can View?
- ✅ COMPANY role
- ✅ ADMIN role
- ✅ SUPERADMIN role
- ❌ STUDENT role (blocked)

### Security
- Frontend: Button hidden from students
- Middleware: Routes protected
- API: Role validation

## 📞 Need Help?

1. Read `RECRUITER_DASHBOARD_GUIDE.md` for detailed info
2. Run test script to check data
3. Run seed script to create test data
4. Check browser console for errors
5. Check server logs for API errors

## ✅ Checklist

- [ ] MongoDB is running
- [ ] `.env` has correct `MONGODB_URI`
- [ ] Ran test script to check data
- [ ] Ran seed script if no data exists
- [ ] Logged in as COMPANY or ADMIN
- [ ] Navigated to "Find Employee" page
- [ ] Can see student list or clear empty state

---

**Ready to go!** 🚀

If you see students in the dashboard, everything is working correctly. If not, run the seed script and you'll have 10 test students immediately.
