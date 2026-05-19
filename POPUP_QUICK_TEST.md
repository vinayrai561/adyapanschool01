# Welcome Popup - Quick Test Guide

## 🚀 Quick Test Commands

### Reset Popup (Show Again)
```javascript
// In browser console (F12)
localStorage.removeItem('welcomePopupDismissed');
location.reload();
```

### Check Popup Status
```javascript
// In browser console
console.log('Popup dismissed:', localStorage.getItem('welcomePopupDismissed'));
// Returns: 'true' (dismissed) or null (not dismissed)
```

---

## ✅ Test Scenarios

### Scenario 1: Student Button (Should Show Again)
```
1. Open browser console (F12)
2. Run: localStorage.removeItem('welcomePopupDismissed')
3. Refresh page
4. Wait for popup to appear
5. Click "Start Your Career Journey"
6. Console shows: "Action clicked - popup will show again..."
7. Don't sign up, just go back to homepage
8. Refresh page
9. ✅ PASS: Popup appears again
```

### Scenario 2: Company Button (Should Show Again)
```
1. Open browser console (F12)
2. Run: localStorage.removeItem('welcomePopupDismissed')
3. Refresh page
4. Wait for popup to appear
5. Click "Post Your First Task"
6. Console shows: "Action clicked - popup will show again..."
7. Don't sign up, just go back to homepage
8. Refresh page
9. ✅ PASS: Popup appears again
```

### Scenario 3: Close Button (Should NOT Show Again)
```
1. Open browser console (F12)
2. Run: localStorage.removeItem('welcomePopupDismissed')
3. Refresh page
4. Wait for popup to appear
5. Click X (close button in top-right)
6. Console shows: "Popup dismissed permanently"
7. Run: console.log(localStorage.getItem('welcomePopupDismissed'))
8. Should show: 'true'
9. Refresh page
10. ✅ PASS: Popup does NOT appear
```

### Scenario 4: Backdrop Click (Should NOT Show Again)
```
1. Open browser console (F12)
2. Run: localStorage.removeItem('welcomePopupDismissed')
3. Refresh page
4. Wait for popup to appear
5. Click backdrop (dark area outside popup)
6. Console shows: "Popup dismissed permanently"
7. Run: console.log(localStorage.getItem('welcomePopupDismissed'))
8. Should show: 'true'
9. Refresh page
10. ✅ PASS: Popup does NOT appear
```

### Scenario 5: Complete Signup (Should NOT Show Again)
```
1. Open browser console (F12)
2. Run: localStorage.removeItem('welcomePopupDismissed')
3. Refresh page
4. Wait for popup to appear
5. Click "Start Your Career Journey"
6. Complete signup/login
7. Go back to homepage
8. Refresh page
9. ✅ PASS: Popup does NOT appear (user is authenticated)
```

---

## 🎯 Expected Console Logs

### When Action Button Clicked:
```
Action clicked - popup will show again if user does not complete signup
```

### When Close/Dismiss:
```
Popup dismissed permanently
```

---

## 📊 Quick Results Table

| Test | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Click Student Button → Don't signup → Refresh | Popup shows again | ⬜ |
| 2 | Click Company Button → Don't signup → Refresh | Popup shows again | ⬜ |
| 3 | Click Close Button (X) → Refresh | Popup does NOT show | ⬜ |
| 4 | Click Backdrop → Refresh | Popup does NOT show | ⬜ |
| 5 | Click Student → Complete signup → Refresh | Popup does NOT show | ⬜ |

**Legend:**
- ⬜ Not tested
- ✅ Passed
- ❌ Failed

---

## 🔧 Troubleshooting

### Problem: Popup not showing at all
**Solution:**
```javascript
// Clear localStorage
localStorage.removeItem('welcomePopupDismissed');
// Logout if logged in
// Refresh page
```

### Problem: Popup shows for logged-in users
**Solution:**
- Check if `/api/auth/me` is returning correct response
- Check browser console for errors
- Verify JWT cookie is being sent

### Problem: Popup shows after clicking X
**Solution:**
- Check browser console for "Popup dismissed permanently"
- Check localStorage: `localStorage.getItem('welcomePopupDismissed')`
- Should be `'true'`

### Problem: Popup doesn't show after clicking action button
**Solution:**
- This is correct if user completed signup/login
- If user didn't signup, check:
  - Console log: "Action clicked - popup will show again..."
  - localStorage should be `null` (not 'true')
  - User should not be authenticated

---

## 🎬 Video Test Flow

### 1. Test Action Buttons (2 minutes)
```
1. Clear localStorage
2. Refresh → Popup appears
3. Click "Student" → Redirects
4. Go back → Refresh → Popup appears ✅
5. Click "Company" → Redirects
6. Go back → Refresh → Popup appears ✅
```

### 2. Test Close/Dismiss (1 minute)
```
1. Clear localStorage
2. Refresh → Popup appears
3. Click X → Popup closes
4. Refresh → Popup does NOT appear ✅
5. Clear localStorage
6. Refresh → Popup appears
7. Click backdrop → Popup closes
8. Refresh → Popup does NOT appear ✅
```

### 3. Test Authentication (2 minutes)
```
1. Clear localStorage
2. Logout (if logged in)
3. Refresh → Popup appears
4. Click "Student"
5. Complete signup/login
6. Go to homepage
7. Refresh → Popup does NOT appear ✅
8. Logout
9. Refresh → Popup appears ✅
```

---

## ⚡ One-Line Tests

### Test 1: Reset and show popup
```javascript
localStorage.removeItem('welcomePopupDismissed'); location.reload();
```

### Test 2: Check if dismissed
```javascript
console.log('Dismissed:', localStorage.getItem('welcomePopupDismissed'));
```

### Test 3: Force dismiss
```javascript
localStorage.setItem('welcomePopupDismissed', 'true'); location.reload();
```

---

## 📱 Mobile Testing

### On Mobile Device:
1. Open browser (Chrome/Safari)
2. Visit homepage
3. Open developer tools (if available)
4. Or use desktop browser in mobile view (F12 → Toggle device toolbar)
5. Test all scenarios above
6. Verify popup is responsive
7. Verify buttons are tap-friendly

---

## ✅ Final Checklist

- [ ] Popup appears for unauthenticated users
- [ ] Popup does NOT appear for authenticated users
- [ ] Student button redirects to `/auth?type=student`
- [ ] Company button redirects to `/company`
- [ ] Action buttons do NOT save to localStorage
- [ ] Popup shows again if user doesn't complete signup
- [ ] Close button (X) saves to localStorage
- [ ] Backdrop click saves to localStorage
- [ ] Popup does NOT show after dismissal
- [ ] Console logs appear correctly
- [ ] Popup is responsive on mobile
- [ ] Animations are smooth

---

## 🎉 Success Criteria

✅ **All actions work correctly**
✅ **localStorage behavior is correct**
✅ **Console logs appear as expected**
✅ **Popup shows/hides based on user action**
✅ **Authentication check works**
✅ **Responsive on all devices**

**Ready for production!** 🚀
