# Navbar Visibility - Quick Test Guide

## 🚀 Quick Tests (2 minutes)

### Test 1: Public Visitor (30 seconds)
```
1. Open browser in incognito mode
2. Visit http://localhost:3000
3. Look at navbar
4. ✅ PASS: "For Recruiter" button is visible (orange border)
```

### Test 2: Student User (30 seconds)
```
1. Login as STUDENT
2. Visit homepage
3. Look at navbar
4. ✅ PASS: "For Recruiter" button is NOT visible
5. ✅ PASS: Only see: Home, About, Gallery, Ambassador, Profile
```

### Test 3: Company User (30 seconds)
```
1. Login as COMPANY
2. Visit homepage
3. Look at navbar
4. ✅ PASS: "For Recruiter" button is visible
5. Click button
6. ✅ PASS: Redirects to /company page
```

### Test 4: Mobile View (30 seconds)
```
1. Not logged in → Open mobile menu
2. ✅ PASS: "For Recruiter" in menu
3. Login as STUDENT → Open mobile menu
4. ✅ PASS: "For Recruiter" NOT in menu
5. Login as COMPANY → Open mobile menu
6. ✅ PASS: "For Recruiter" in menu
```

---

## Expected Results Table

| User Type | Desktop Button | Mobile Menu | Status |
|-----------|---------------|-------------|--------|
| **Public (not logged in)** | ✅ Visible | ✅ Visible | ⬜ |
| **STUDENT** | ❌ Hidden | ❌ Hidden | ⬜ |
| **COMPANY** | ✅ Visible | ✅ Visible | ⬜ |
| **ADMIN** | ✅ Visible | ✅ Visible | ⬜ |
| **SUPERADMIN** | ✅ Visible | ✅ Visible | ⬜ |

---

## Visual Verification

### Public Visitor:
```
Navbar should show:
[Logo] [All Programs] [Home] [About] [Gallery] [Ambassador] [For Recruiter] [Login] [Sign Up]
                                                                    ↑
                                                            Should be visible
```

### Student User:
```
Navbar should show:
[Logo] [All Programs] [Home] [About] [Gallery] [Ambassador] [Profile ▼]
                                                                    ↑
                                                    No "For Recruiter" button
```

### Company User:
```
Navbar should show:
[Logo] [All Programs] [Home] [About] [Gallery] [Ambassador] [For Recruiter] [Profile ▼]
                                                                    ↑
                                                            Should be visible
```

---

## Debug Commands

### Check Current User:
```javascript
// In browser console (F12)
fetch('/api/auth/me')
  .then(r => r.json())
  .then(d => console.log('User:', d.user?.role || 'Not logged in'));
```

### Check Button Visibility:
```javascript
// In browser console
const button = document.querySelector('a[href="/company"]');
console.log('Button visible:', button !== null);
console.log('Button text:', button?.textContent);
```

---

## Common Issues

### Issue: Button shows for students
**Check:**
```javascript
// In browser console
fetch('/api/auth/me')
  .then(r => r.json())
  .then(d => console.log('Role:', d.user?.role));
// Should show: "STUDENT"
```
**Solution:** Clear cache and refresh

### Issue: Button doesn't show for public visitors
**Check:**
```javascript
// In browser console
fetch('/api/auth/me')
  .then(r => console.log('Status:', r.status));
// Should show: 401 (Unauthorized)
```
**Solution:** Make sure you're not logged in

### Issue: Button doesn't show for company users
**Check:**
```javascript
// In browser console
fetch('/api/auth/me')
  .then(r => r.json())
  .then(d => console.log('Role:', d.user?.role));
// Should show: "COMPANY"
```
**Solution:** Verify login and role

---

## One-Line Tests

### Test as Public:
```javascript
// Logout and check
fetch('/api/auth/logout', {method: 'POST'}).then(() => location.reload());
```

### Test as Student:
```javascript
// Login as student and check navbar
```

### Test as Company:
```javascript
// Login as company and check navbar
```

---

## Success Criteria

✅ Public visitors see button  
✅ Students don't see button  
✅ Companies see button  
✅ Admins see button  
✅ Mobile menu matches desktop  
✅ Button redirects to /company  
✅ Smooth animations work  

**All criteria must pass!** ✨
