# 🚀 Quick Start: Show Database Data in Recruiter Dashboard

## ⚡ Super Quick Setup (3 Steps)

### Step 1: Check Your Database
```bash
npm run db:check
```

This shows what data you currently have.

### Step 2: Add Sample Data (if needed)
```bash
npm run db:seed-recruiter
```

This creates:
- 5 sample students
- 5 enrollments
- 2 placements
- 1 recruiter account

### Step 3: Login and View
1. Start server: `npm run dev`
2. Login as: `recruiter@adyapan.com` / `recruiter123`
3. Go to: `http://localhost:3000/company/find-employee`
4. **You should see students!** 🎉

---

## 📊 What You'll See

### Dashboard Overview
```
┌─────────────────────────────────────────┐
│  Total Students: 5                      │
│  Available: 3                           │
│  Already Placed: 2                      │
│  Shortlisted: 0                         │
└─────────────────────────────────────────┘
```

### Student Cards
```
┌─────────────────────────────────────────┐
│  AS  Aarohi Sharma        [Available]   │
│      Full Stack Development             │
│      B.Tech in Computer Science         │
│      Skills: React, Node.js, MongoDB    │
│      Projects: 2 | Certs: 1 | ⭐ 4.7   │
│                                         │
│  [View Profile] [Download CV] [Shortlist]│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  RV  Rohit Verma          [Placed]      │
│      Data Science & Analytics           │
│      B.Des in Communication Design      │
│      Placed at: Infosys - ₹6.5 LPA     │
│                                         │
│  [View Profile] [Download CV] [Placed]  │
└─────────────────────────────────────────┘
```

### Placement Highlights
```
┌─────────────────────────────┐
│  Total Placed: 2            │
│  Avg Package: ₹7.3 LPA     │
│                             │
│  Top Companies:             │
│  • Tech Mahindra           │
│  • Infosys                 │
└─────────────────────────────┘
```

---

## 🔍 Verify Data is Showing

### ✅ Checklist

After logging in, you should see:

- [ ] Overview cards with numbers (not zeros)
- [ ] Student cards with names and photos
- [ ] Course names displayed
- [ ] Skills shown (derived from courses)
- [ ] Projects and certificates count
- [ ] "Available" or "Placed" status
- [ ] Placement info for placed students
- [ ] Action buttons (View, Download CV, Shortlist)
- [ ] Placement highlights in right sidebar

### ❌ If You See "No students found"

**Problem:** No enrolled students in database.

**Quick Fix:**
```bash
npm run db:seed-recruiter
```

Then refresh the page.

---

## 🎯 Test All Features

### 1. Search
- Type "Aarohi" in search box
- Should filter to show only Aarohi

### 2. Filters
- Select "Full Stack" in Course filter
- Should show only Full Stack students

### 3. Tabs
- Click "Placed" tab
- Should show only 2 placed students

### 4. View Profile
- Click "View Profile" on any student
- Modal should open with full details

### 5. Shortlist
- Click "Shortlist" on available student
- Button should change to "Listed"
- Shortlisted count should increase

### 6. Download CV
- Click "Download CV"
- Should show "CV not uploaded" (CVs not seeded)
- This is expected - CV upload needs to be implemented

---

## 📝 Sample Data Details

### Students Created:
1. **Aarohi Sharma** - Full Stack Development
   - Status: Placed at Tech Mahindra
   - Package: ₹8.0 LPA
   - Progress: 35%

2. **Rohit Verma** - Data Science
   - Status: Placed at Infosys
   - Package: ₹6.5 LPA
   - Progress: 50%

3. **Priya Mehta** - Machine Learning & AI
   - Status: Available
   - Progress: 65%

4. **Karan Joshi** - DevOps Engineering
   - Status: Available
   - Progress: 80%

5. **Sneha Reddy** - Android Development
   - Status: Available
   - Progress: 95%

### Recruiter Account:
- **Email:** recruiter@adyapan.com
- **Password:** recruiter123
- **Role:** COMPANY

---

## 🔧 Troubleshooting

### Issue: "Forbidden - insufficient permissions"
**Solution:** You're logged in as STUDENT. Logout and login as recruiter.

### Issue: "Unauthorized"
**Solution:** Not logged in. Go to login page first.

### Issue: Dashboard shows 0 students
**Solution:** 
```bash
# Check database
npm run db:check

# If no enrollments, seed data
npm run db:seed-recruiter
```

### Issue: Can't login as recruiter
**Solution:** 
```bash
# Seed will create recruiter account
npm run db:seed-recruiter

# Then login with:
# Email: recruiter@adyapan.com
# Password: recruiter123
```

---

## 🎨 What the Dashboard Shows

### From Database Collections:

**authusers** → Student names, emails, education
**enrollments** → Course names, enrollment status
**progresses** → Course progress percentage
**certificates** → Certificate count
**placements** → Placement status, company, package
**recruitershortlists** → Shortlisted students

### Derived Data:

**Skills** → Extracted from course names
**Projects Count** → Number of completed courses
**Rating** → Generated (4.5-5.0 range)
**Availability** → Based on placement status

---

## 📊 Database Commands

### Check what's in database:
```bash
npm run db:check
```

### Add sample data:
```bash
npm run db:seed-recruiter
```

### Start development server:
```bash
npm run dev
```

### Access dashboard:
```
http://localhost:3000/company/find-employee
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Dashboard loads without errors
2. ✅ Overview cards show numbers > 0
3. ✅ Student cards appear with names
4. ✅ Search filters the list
5. ✅ Filters update the list
6. ✅ Tabs switch correctly
7. ✅ Shortlist button works
8. ✅ Placement info shows for placed students

---

## 🚀 Next Steps

Once you see data:

1. **Add Real Students**
   - Students register on platform
   - Students purchase courses
   - Students get enrolled
   - Students appear in dashboard

2. **Implement CV Upload**
   - Create CV upload page for students
   - Store CVs in cloud storage
   - Enable CV download in dashboard

3. **Add More Features**
   - Email notifications
   - Advanced search
   - Bulk actions
   - Analytics dashboard

---

## 📞 Quick Help

### Commands Reference:
```bash
# Check database
npm run db:check

# Add sample data
npm run db:seed-recruiter

# Start server
npm run dev

# Access dashboard
# http://localhost:3000/company/find-employee
```

### Login Credentials:
```
Email: recruiter@adyapan.com
Password: recruiter123
```

### Expected Result:
- 5 students visible
- 2 placed, 3 available
- All buttons functional
- Real data from MongoDB

---

## 🎉 That's It!

You should now see real database data in your recruiter dashboard!

**If you see students, you're done!** 🎊

If not, run:
```bash
npm run db:check
```

And follow the recommendations shown.

---

**Happy Recruiting!** 🚀
