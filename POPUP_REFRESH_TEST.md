# Welcome Popup - Refresh Test Guide

## 🚀 Quick Test: Refresh Behavior

### Test 1: Action Button + Refresh (Should NOT Show)
```bash
Step 1: Clear storage
  sessionStorage.removeItem('welcomePopupShown');
  localStorage.removeItem('welcomePopupDismissed');
  location.reload();

Step 2: Wait for popup to appear (1 second)

Step 3: Click "Start Your Career Journey"
  Console: "Action clicked - popup will show again in new browser session or after refresh"

Step 4: Press F5 (refresh page)

✅ EXPECTED: Popup does NOT appear
✅ REASON: sessionStorage still has 'welcomePopupShown' = 'true'
```

### Test 2: Action Button + Browser Restart (Should Show)
```bash
Step 1: Clear storage
  sessionStorage.removeItem('welcomePopupShown');
  localStorage.removeItem('welcomePopupDismissed');
  location.reload();

Step 2: Wait for popup to appear

Step 3: Click "Start Your Career Journey"

Step 4: Close browser completely (Ctrl+Shift+Q or Cmd+Q)

Step 5: Open browser again

Step 6: Visit homepage

✅ EXPECTED: Popup appears again
✅ REASON: sessionStorage cleared on browser close
```

### Test 3: Close Button + Refresh (Should NOT Show)
```bash
Step 1: Clear storage
  sessionStorage.removeItem('welcomePopupShown');
  localStorage.removeItem('welcomePopupDismissed');
  location.reload();

Step 2: Wait for popup to appear

Step 3: Click X (close button)
  Console: "Popup dismissed permanently - will never show again"

Step 4: Press F5 (refresh page)

✅ EXPECTED: Popup does NOT appear
✅ REASON: localStorage has 'welcomePopupDismissed' = 'true'
```

### Test 4: Close Button + Browser Restart (Should NOT Show)
```bash
Step 1: Clear storage
  sessionStorage.removeItem('welcomePopupShown');
  localStorage.removeItem('welcomePopupDismissed');
  location.reload();

Step 2: Wait for popup to appear

Step 3: Click X (close button)

Step 4: Close browser completely

Step 5: Open browser again

Step 6: Visit homepage

✅ EXPECTED: Popup does NOT appear
✅ REASON: localStorage persists across browser restarts
```

---

## 📊 Quick Results Table

| Test | Action | Refresh | Browser Restart | Status |
|------|--------|---------|-----------------|--------|
| 1 | Click Student → Refresh | ❌ No popup | - | ⬜ |
| 2 | Click Student → Restart | - | ✅ Popup shows | ⬜ |
| 3 | Click Company → Refresh | ❌ No popup | - | ⬜ |
| 4 | Click Company → Restart | - | ✅ Popup shows | ⬜ |
| 5 | Click X → Refresh | ❌ No popup | - | ⬜ |
| 6 | Click X → Restart | - | ❌ No popup | ⬜ |
| 7 | Click Backdrop → Refresh | ❌ No popup | - | ⬜ |
| 8 | Click Backdrop → Restart | - | ❌ No popup | ⬜ |

---

## 🔍 Debug Commands

### Check Current State:
```javascript
console.log({
  session: sessionStorage.getItem('welcomePopupShown'),
  permanent: localStorage.getItem('welcomePopupDismissed')
});
```

### Expected Results:

#### After Action Button Click:
```javascript
{
  session: 'true',      // Set when popup first appears
  permanent: null       // Not set by action buttons
}
```

#### After Close Button Click:
```javascript
{
  session: 'true',      // Set when popup first appears
  permanent: 'true'     // Set by close button
}
```

#### After Browser Restart (Action Button):
```javascript
{
  session: null,        // Cleared on browser close
  permanent: null       // Not set by action buttons
}
// Result: Popup will show again
```

#### After Browser Restart (Close Button):
```javascript
{
  session: null,        // Cleared on browser close
  permanent: 'true'     // Persists across restarts
}
// Result: Popup will NOT show
```

---

## 🎯 Visual Flow

### Action Button Flow:
```
Visit → Popup appears → Click Student → Refresh
                ↓              ↓            ↓
        sessionStorage    Close popup   No popup
        = 'true'                        (session active)
                                            ↓
                                    Close browser
                                            ↓
                                    sessionStorage cleared
                                            ↓
                                    Open browser → Visit
                                            ↓
                                    Popup appears ✅
```

### Close Button Flow:
```
Visit → Popup appears → Click X → Refresh
                ↓           ↓         ↓
        sessionStorage  localStorage  No popup
        = 'true'        = 'true'      (permanent)
                                         ↓
                                   Close browser
                                         ↓
                                   localStorage persists
                                         ↓
                                   Open browser → Visit
                                         ↓
                                   No popup ❌
```

---

## 🧪 One-Line Tests

### Reset Everything:
```javascript
sessionStorage.clear(); localStorage.clear(); location.reload();
```

### Show Popup Again (Same Session):
```javascript
sessionStorage.removeItem('welcomePopupShown'); location.reload();
```

### Show Popup Again (Permanent):
```javascript
localStorage.removeItem('welcomePopupDismissed'); sessionStorage.removeItem('welcomePopupShown'); location.reload();
```

### Force Hide Popup:
```javascript
sessionStorage.setItem('welcomePopupShown', 'true'); location.reload();
```

---

## 📱 Mobile Testing

### On Mobile Browser:
1. Open Chrome/Safari on mobile
2. Visit homepage
3. Popup appears
4. Click action button
5. Refresh page (pull down)
6. ✅ Popup should NOT appear
7. Close browser app completely
8. Open browser app again
9. Visit homepage
10. ✅ Popup should appear

---

## 🎬 Video Test Script (2 minutes)

### Part 1: Action Button (30 seconds)
```
1. Clear storage → Refresh
2. Popup appears
3. Click "Student"
4. Refresh page
5. ✅ No popup (session active)
```

### Part 2: Browser Restart (30 seconds)
```
1. Close browser completely
2. Open browser
3. Visit homepage
4. ✅ Popup appears (new session)
```

### Part 3: Close Button (30 seconds)
```
1. Click X
2. Refresh page
3. ✅ No popup (permanent)
```

### Part 4: Permanent Dismissal (30 seconds)
```
1. Close browser
2. Open browser
3. Visit homepage
4. ✅ No popup (localStorage persists)
```

---

## ⚠️ Common Issues

### Issue: Popup shows on every refresh
**Cause:** sessionStorage not being set  
**Check:**
```javascript
console.log(sessionStorage.getItem('welcomePopupShown'));
// Should be 'true' after popup appears
```

### Issue: Popup doesn't show after browser restart
**Cause:** localStorage is set (permanent dismissal)  
**Fix:**
```javascript
localStorage.removeItem('welcomePopupDismissed');
```

### Issue: Popup shows multiple times in same session
**Cause:** sessionStorage not working  
**Check:** Browser privacy settings, incognito mode

---

## ✅ Success Criteria

- [ ] Action button: Popup does NOT show on refresh
- [ ] Action button: Popup SHOWS after browser restart
- [ ] Close button: Popup does NOT show on refresh
- [ ] Close button: Popup does NOT show after browser restart
- [ ] sessionStorage set when popup appears
- [ ] localStorage set only when X/backdrop clicked
- [ ] Console logs appear correctly
- [ ] Works in incognito mode
- [ ] Works across multiple tabs

---

## 🎉 Expected Behavior Summary

| Scenario | Refresh | Browser Restart |
|----------|---------|-----------------|
| **Click Student** | ❌ No popup | ✅ Popup shows |
| **Click Company** | ❌ No popup | ✅ Popup shows |
| **Click X** | ❌ No popup | ❌ No popup |
| **Click Backdrop** | ❌ No popup | ❌ No popup |
| **Complete Signup** | ❌ No popup | ❌ No popup |

**Perfect balance between conversion and UX!** ✨
