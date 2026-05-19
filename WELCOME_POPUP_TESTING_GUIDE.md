# Welcome Popup - Testing Guide

## Quick Test Commands

### Clear localStorage (Reset Popup)
```javascript
// In browser console
localStorage.removeItem('welcomePopupDismissed');
location.reload();
```

### Check localStorage Status
```javascript
// In browser console
console.log('Popup dismissed:', localStorage.getItem('welcomePopupDismissed'));
// Returns: 'true' or null
```

### Force Show Popup (For Testing)
```javascript
// In browser console
localStorage.removeItem('welcomePopupDismissed');
// Then logout if logged in
// Then refresh page
```

---

## Test Scenarios

### ✅ Test 1: New Visitor (Not Logged In)

**Steps:**
1. Open browser in **incognito/private mode**
2. Navigate to `http://localhost:3000`
3. Wait 1-2 seconds

**Expected Result:**
- ✅ Popup appears after ~1 second
- ✅ Two cards visible: "I'm a Student" and "I'm a Company"
- ✅ Close button (X) visible in top-right
- ✅ Backdrop blur effect visible
- ✅ Smooth fade-in animation

**Pass Criteria:**
- Popup shows for unauthenticated users
- Animation is smooth
- All buttons are clickable

---

### ✅ Test 2: Student User (Logged In)

**Steps:**
1. Login as a **student** user
2. Navigate to `http://localhost:3000`
3. Wait 2 seconds

**Expected Result:**
- ✅ Popup does NOT appear
- ✅ Page loads normally
- ✅ No backdrop or modal visible
- ✅ User can navigate freely

**Pass Criteria:**
- Authenticated students never see popup
- No flash or flicker
- Page loads smoothly

---

### ✅ Test 3: Company User (Logged In)

**Steps:**
1. Login as a **company/organization** user
2. Navigate to `http://localhost:3000`
3. Wait 2 seconds

**Expected Result:**
- ✅ Popup does NOT appear
- ✅ Page loads normally
- ✅ No backdrop or modal visible
- ✅ User can navigate freely

**Pass Criteria:**
- Authenticated companies never see popup
- No flash or flicker
- Page loads smoothly

---

### ✅ Test 4: Admin User (Logged In)

**Steps:**
1. Login as an **admin** user
2. Navigate to `http://localhost:3000`
3. Wait 2 seconds

**Expected Result:**
- ✅ Popup does NOT appear
- ✅ Page loads normally
- ✅ No backdrop or modal visible
- ✅ User can navigate freely

**Pass Criteria:**
- Authenticated admins never see popup
- No flash or flicker
- Page loads smoothly

---

### ✅ Test 5: SuperAdmin User (Logged In)

**Steps:**
1. Login as a **superadmin** user
2. Navigate to `http://localhost:3000`
3. Wait 2 seconds

**Expected Result:**
- ✅ Popup does NOT appear
- ✅ Page loads normally
- ✅ No backdrop or modal visible
- ✅ User can navigate freely

**Pass Criteria:**
- Authenticated superadmins never see popup
- No flash or flicker
- Page loads smoothly

---

### ✅ Test 6: Dismiss Popup (Close Button)

**Steps:**
1. Open browser in **incognito mode**
2. Navigate to `http://localhost:3000`
3. Wait for popup to appear
4. Click the **X (close)** button
5. Refresh the page

**Expected Result:**
- ✅ Popup closes immediately when X is clicked
- ✅ Smooth fade-out animation
- ✅ After refresh, popup does NOT appear again
- ✅ localStorage has `welcomePopupDismissed = 'true'`

**Pass Criteria:**
- User dismissal is remembered
- Popup doesn't show again after refresh
- localStorage is set correctly

---

### ✅ Test 7: Dismiss Popup (Backdrop Click)

**Steps:**
1. Open browser in **incognito mode**
2. Navigate to `http://localhost:3000`
3. Wait for popup to appear
4. Click on the **backdrop** (dark area outside popup)
5. Refresh the page

**Expected Result:**
- ✅ Popup closes when backdrop is clicked
- ✅ Smooth fade-out animation
- ✅ After refresh, popup does NOT appear again
- ✅ localStorage has `welcomePopupDismissed = 'true'`

**Pass Criteria:**
- Backdrop click dismisses popup
- User choice is remembered
- Popup doesn't show again

---

### ✅ Test 8: Student Button Click

**Steps:**
1. Open browser in **incognito mode**
2. Navigate to `http://localhost:3000`
3. Wait for popup to appear
4. Click **"Start Your Career Journey"** button

**Expected Result:**
- ✅ Redirects to `/auth?type=student`
- ✅ Popup closes before redirect
- ✅ localStorage has `welcomePopupDismissed = 'true'`
- ✅ After going back, popup does NOT appear

**Pass Criteria:**
- Button redirects correctly
- Popup dismissal is saved
- User doesn't see popup again

---

### ✅ Test 9: Company Button Click

**Steps:**
1. Open browser in **incognito mode**
2. Navigate to `http://localhost:3000`
3. Wait for popup to appear
4. Click **"Post Your First Task"** button

**Expected Result:**
- ✅ Redirects to `/company`
- ✅ Popup closes before redirect
- ✅ localStorage has `welcomePopupDismissed = 'true'`
- ✅ After going back, popup does NOT appear

**Pass Criteria:**
- Button redirects correctly
- Popup dismissal is saved
- User doesn't see popup again

---

### ✅ Test 10: After Logout

**Steps:**
1. Login as any user (student/company/admin)
2. Navigate to homepage (popup should NOT show)
3. **Logout**
4. Navigate to `http://localhost:3000`
5. Wait 2 seconds

**Expected Result:**
- ✅ After logout, popup appears again
- ✅ User is now unauthenticated
- ✅ Popup shows after ~1 second
- ✅ All buttons work correctly

**Pass Criteria:**
- Popup shows after logout
- User is treated as new visitor
- Auth check works correctly

---

### ✅ Test 11: Clear localStorage

**Steps:**
1. Open browser (any mode)
2. Dismiss the popup (if it appears)
3. Open browser console
4. Run: `localStorage.removeItem('welcomePopupDismissed');`
5. Refresh the page

**Expected Result:**
- ✅ Popup appears again (if not logged in)
- ✅ localStorage is cleared
- ✅ User is treated as new visitor

**Pass Criteria:**
- Clearing localStorage resets popup state
- Popup shows again for unauthenticated users

---

### ✅ Test 12: Multiple Tabs

**Steps:**
1. Open browser in **incognito mode**
2. Open Tab 1: Navigate to `http://localhost:3000`
3. Wait for popup, then dismiss it
4. Open Tab 2: Navigate to `http://localhost:3000`

**Expected Result:**
- ✅ Tab 1: Popup appears, then dismissed
- ✅ Tab 2: Popup does NOT appear (localStorage shared)
- ✅ Both tabs respect the same localStorage

**Pass Criteria:**
- localStorage is shared across tabs
- Dismissal in one tab affects all tabs

---

### ✅ Test 13: Slow Network (Simulated)

**Steps:**
1. Open browser DevTools
2. Go to **Network** tab
3. Set throttling to **Slow 3G**
4. Open incognito mode
5. Navigate to `http://localhost:3000`
6. Wait for popup

**Expected Result:**
- ✅ Page loads slowly
- ✅ Popup waits for auth check to complete
- ✅ No flash or flicker
- ✅ Popup appears after auth check + 1s delay

**Pass Criteria:**
- Loading state prevents flash
- Popup waits for auth check
- Smooth user experience

---

### ✅ Test 14: API Error (Simulated)

**Steps:**
1. Stop the backend server
2. Open browser in **incognito mode**
3. Navigate to `http://localhost:3000`
4. Wait 2 seconds

**Expected Result:**
- ✅ API call to `/api/auth/me` fails
- ✅ Popup still appears (fail-safe behavior)
- ✅ User can interact with popup
- ✅ No console errors break the page

**Pass Criteria:**
- Graceful error handling
- Popup shows as fail-safe
- User experience not broken

---

### ✅ Test 15: Session Expired

**Steps:**
1. Login as any user
2. Wait for JWT to expire (or manually delete auth cookie)
3. Navigate to `http://localhost:3000`
4. Wait 2 seconds

**Expected Result:**
- ✅ Auth check fails (401 Unauthorized)
- ✅ Popup appears (user is now unauthenticated)
- ✅ User can re-login via popup

**Pass Criteria:**
- Expired sessions trigger popup
- User can re-authenticate
- Auth check works correctly

---

### ✅ Test 16: Mobile Responsive

**Steps:**
1. Open browser in **incognito mode**
2. Open DevTools
3. Toggle **device toolbar** (mobile view)
4. Select **iPhone 12 Pro** or similar
5. Navigate to `http://localhost:3000`
6. Wait for popup

**Expected Result:**
- ✅ Popup appears and is fully responsive
- ✅ Cards stack vertically on mobile
- ✅ Buttons are tap-friendly
- ✅ Close button is easily accessible
- ✅ Text is readable
- ✅ No horizontal scroll

**Pass Criteria:**
- Mobile layout works correctly
- All interactions are touch-friendly
- No layout issues

---

### ✅ Test 17: Tablet Responsive

**Steps:**
1. Open browser in **incognito mode**
2. Open DevTools
3. Toggle **device toolbar** (tablet view)
4. Select **iPad** or similar
5. Navigate to `http://localhost:3000`
6. Wait for popup

**Expected Result:**
- ✅ Popup appears and is fully responsive
- ✅ Cards may be side-by-side or stacked
- ✅ Buttons are tap-friendly
- ✅ Close button is easily accessible
- ✅ Text is readable
- ✅ No layout issues

**Pass Criteria:**
- Tablet layout works correctly
- All interactions work smoothly
- No layout issues

---

### ✅ Test 18: Desktop Responsive

**Steps:**
1. Open browser in **incognito mode**
2. Set browser to **full screen** (1920x1080)
3. Navigate to `http://localhost:3000`
4. Wait for popup

**Expected Result:**
- ✅ Popup appears centered on screen
- ✅ Cards are side-by-side
- ✅ Backdrop covers entire viewport
- ✅ Close button is visible
- ✅ Hover effects work on buttons
- ✅ Smooth animations

**Pass Criteria:**
- Desktop layout is optimal
- All hover effects work
- Animations are smooth

---

### ✅ Test 19: Keyboard Navigation

**Steps:**
1. Open browser in **incognito mode**
2. Navigate to `http://localhost:3000`
3. Wait for popup to appear
4. Press **Tab** key multiple times
5. Press **Enter** on focused button

**Expected Result:**
- ✅ Tab key cycles through interactive elements
- ✅ Focus indicators are visible
- ✅ Enter key activates buttons
- ✅ Escape key closes popup (if implemented)

**Pass Criteria:**
- Keyboard navigation works
- Focus is visible
- Accessible for keyboard users

---

### ✅ Test 20: Animation Performance

**Steps:**
1. Open browser in **incognito mode**
2. Open DevTools
3. Go to **Performance** tab
4. Start recording
5. Navigate to `http://localhost:3000`
6. Wait for popup to appear
7. Close popup
8. Stop recording

**Expected Result:**
- ✅ No frame drops during animation
- ✅ Smooth 60fps animation
- ✅ No layout thrashing
- ✅ GPU-accelerated transforms

**Pass Criteria:**
- Animations are smooth
- No performance issues
- Efficient rendering

---

## Automated Testing (Optional)

### Cypress Test Example

```javascript
describe('Welcome Popup', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should show popup for unauthenticated users', () => {
    cy.visit('/');
    cy.wait(1500);
    cy.get('[data-testid="welcome-popup"]').should('be.visible');
  });

  it('should not show popup for authenticated users', () => {
    cy.login(); // Custom command to login
    cy.visit('/');
    cy.wait(2000);
    cy.get('[data-testid="welcome-popup"]').should('not.exist');
  });

  it('should remember dismissal', () => {
    cy.visit('/');
    cy.wait(1500);
    cy.get('[data-testid="close-button"]').click();
    cy.reload();
    cy.wait(2000);
    cy.get('[data-testid="welcome-popup"]').should('not.exist');
  });
});
```

---

## Test Results Template

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | New Visitor | ⬜ | |
| 2 | Student User | ⬜ | |
| 3 | Company User | ⬜ | |
| 4 | Admin User | ⬜ | |
| 5 | SuperAdmin User | ⬜ | |
| 6 | Dismiss (Close) | ⬜ | |
| 7 | Dismiss (Backdrop) | ⬜ | |
| 8 | Student Button | ⬜ | |
| 9 | Company Button | ⬜ | |
| 10 | After Logout | ⬜ | |
| 11 | Clear localStorage | ⬜ | |
| 12 | Multiple Tabs | ⬜ | |
| 13 | Slow Network | ⬜ | |
| 14 | API Error | ⬜ | |
| 15 | Session Expired | ⬜ | |
| 16 | Mobile Responsive | ⬜ | |
| 17 | Tablet Responsive | ⬜ | |
| 18 | Desktop Responsive | ⬜ | |
| 19 | Keyboard Navigation | ⬜ | |
| 20 | Animation Performance | ⬜ | |

**Legend:**
- ⬜ Not tested
- ✅ Passed
- ❌ Failed
- ⚠️ Needs review

---

## Common Issues & Solutions

### Issue: Popup shows for logged-in users
**Cause**: Auth cookie not being sent  
**Solution**: Check `credentials: 'include'` in fetch call

### Issue: Popup doesn't show for new visitors
**Cause**: localStorage has `welcomePopupDismissed = 'true'`  
**Solution**: Clear localStorage and refresh

### Issue: Popup flashes briefly
**Cause**: Loading state not working  
**Solution**: Check `isLoading` state logic

### Issue: Popup shows repeatedly
**Cause**: localStorage not being set  
**Solution**: Check `closePopup()` function

### Issue: API call fails
**Cause**: Backend not running or CORS issue  
**Solution**: Start backend and check CORS settings

---

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Time to auth check | < 200ms | ⬜ |
| Time to popup show | ~1000ms | ⬜ |
| Animation duration | 300-500ms | ⬜ |
| localStorage read | < 10ms | ⬜ |
| Component mount | < 50ms | ⬜ |

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ⬜ |
| Firefox | Latest | ⬜ |
| Safari | Latest | ⬜ |
| Edge | Latest | ⬜ |
| Mobile Safari | iOS 14+ | ⬜ |
| Chrome Mobile | Latest | ⬜ |

---

## Summary

✅ **20 comprehensive test scenarios**  
✅ **Manual testing guide**  
✅ **Automated testing examples**  
✅ **Performance benchmarks**  
✅ **Browser compatibility checklist**  
✅ **Common issues & solutions**  

**Ready for QA testing!**
