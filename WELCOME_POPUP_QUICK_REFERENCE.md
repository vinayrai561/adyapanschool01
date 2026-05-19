# Welcome Popup - Quick Reference

## When Does Popup Show?

| User Status | Popup Shows? | Reason |
|------------|--------------|--------|
| **Not logged in** | ✅ YES | New visitor needs to choose role |
| **Logged in as Student** | ❌ NO | Already authenticated |
| **Logged in as Company** | ❌ NO | Already authenticated |
| **Logged in as Admin** | ❌ NO | Already authenticated |
| **Logged in as SuperAdmin** | ❌ NO | Already authenticated |
| **Previously dismissed popup** | ❌ NO | User choice remembered |
| **After logout** | ✅ YES | User is now unauthenticated |

---

## How It Works

```
User visits site
    ↓
Check localStorage: "welcomePopupDismissed"?
    ↓
    ├─ YES → Don't show popup
    └─ NO → Check authentication
              ↓
              Call /api/auth/me
              ↓
              ├─ 200 OK → User logged in → Don't show popup
              └─ 401/Error → User not logged in → Show popup after 1s
```

---

## User Actions

### Student Button
- **Text**: "Start Your Career Journey"
- **Link**: `/auth?type=student`
- **Action**: Redirects to student signup/login

### Company Button
- **Text**: "Post Your First Task"
- **Link**: `/company`
- **Action**: Redirects to company page

### Close Button (X)
- **Action**: Closes popup + saves to localStorage
- **Result**: Popup won't show again

---

## localStorage Key

```javascript
// Key name
'welcomePopupDismissed'

// Value
'true' // Popup dismissed
null   // Popup not dismissed yet
```

---

## API Endpoint Used

```
GET /api/auth/me
```

**Response:**
- `200 OK` → User is authenticated
- `401 Unauthorized` → User is not authenticated
- `403 Forbidden` → Account suspended
- `404 Not Found` → User not found

---

## Testing Commands

### Clear localStorage (show popup again)
```javascript
// In browser console
localStorage.removeItem('welcomePopupDismissed');
```

### Check if popup was dismissed
```javascript
// In browser console
localStorage.getItem('welcomePopupDismissed');
// Returns: 'true' or null
```

### Manually trigger popup (for testing)
```javascript
// In browser console
localStorage.removeItem('welcomePopupDismissed');
location.reload();
```

---

## File Location

```
src/components/WelcomePopup.tsx
```

**Rendered in:**
```
src/app/(student)/layout.tsx
```

---

## Timing

- **Auth check**: Immediate on page load
- **Popup delay**: 1 second after auth check completes
- **Animation**: 0.3-0.5s fade-in

---

## Common Issues & Solutions

### Issue: Popup shows for logged-in users
**Solution**: Clear browser cache and cookies, then login again

### Issue: Popup doesn't show for new visitors
**Solution**: Check if `welcomePopupDismissed` is in localStorage, remove it

### Issue: Popup flashes briefly
**Solution**: This is normal - loading state prevents most flashing

### Issue: Popup shows after logout
**Solution**: This is correct behavior - user is now unauthenticated

---

## Role-Based Redirects (After Login)

| Role | Redirect To |
|------|-------------|
| STUDENT | `/dashboard` |
| COMPANY | `/organization` |
| ADMIN | `/admin` |
| SUPERADMIN | `/admin` |

---

## Security

✅ Uses cookie-based authentication  
✅ No sensitive data in localStorage  
✅ Graceful error handling  
✅ No token exposure  

---

## Performance

⚡ localStorage check first (no API call if dismissed)  
⚡ Single auth check per page load  
⚡ No polling or repeated checks  
⚡ Lazy rendering (only when needed)  
