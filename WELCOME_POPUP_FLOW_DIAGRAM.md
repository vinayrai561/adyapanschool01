# Welcome Popup - Flow Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER VISITS WEBSITE                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              WelcomePopup Component Mounts                      │
│              useEffect() runs on page load                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         Check localStorage: "welcomePopupDismissed"             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │ Value = true │          │ Value = null │
        └──────┬───────┘          └──────┬───────┘
               │                         │
               ▼                         ▼
    ┌──────────────────┐    ┌──────────────────────────┐
    │ DON'T SHOW POPUP │    │ Call /api/auth/me        │
    │ setIsLoading(false)│  │ Check authentication     │
    └──────────────────┘    └──────────┬───────────────┘
                                       │
                          ┌────────────┴────────────┐
                          │                         │
                          ▼                         ▼
                  ┌──────────────┐          ┌──────────────┐
                  │ 200 OK       │          │ 401/Error    │
                  │ User logged  │          │ Not logged   │
                  │ in           │          │ in           │
                  └──────┬───────┘          └──────┬───────┘
                         │                         │
                         ▼                         ▼
              ┌──────────────────┐    ┌──────────────────────────┐
              │ DON'T SHOW POPUP │    │ Wait 1 second            │
              │ setIsLoading(false)│  │ Then show popup          │
              └──────────────────┘    │ setIsOpen(true)          │
                                      │ setIsLoading(false)      │
                                      └──────────┬───────────────┘
                                                 │
                                                 ▼
                                      ┌──────────────────────────┐
                                      │ POPUP APPEARS            │
                                      │ User sees two cards:     │
                                      │ - I'm a Student          │
                                      │ - I'm a Company          │
                                      └──────────┬───────────────┘
                                                 │
                          ┌──────────────────────┼──────────────────────┐
                          │                      │                      │
                          ▼                      ▼                      ▼
                  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                  │ Click        │      │ Click        │      │ Click        │
                  │ "Student"    │      │ "Company"    │      │ Close (X)    │
                  │ button       │      │ button       │      │ button       │
                  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
                         │                     │                     │
                         ▼                     ▼                     ▼
                  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                  │ closePopup() │      │ closePopup() │      │ closePopup() │
                  │ Save to      │      │ Save to      │      │ Save to      │
                  │ localStorage │      │ localStorage │      │ localStorage │
                  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
                         │                     │                     │
                         ▼                     ▼                     ▼
                  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                  │ Redirect to  │      │ Redirect to  │      │ Stay on      │
                  │ /auth?type=  │      │ /company     │      │ current page │
                  │ student      │      │              │      │              │
                  └──────────────┘      └──────────────┘      └──────────────┘
```

---

## State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                        INITIAL STATE                            │
│  isOpen = false                                                 │
│  isLoading = true                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKING AUTH STATE                          │
│  isOpen = false                                                 │
│  isLoading = true                                               │
│  (API call in progress)                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   USER AUTHENTICATED    │   │  USER NOT AUTHENTICATED │
│   isOpen = false        │   │  isOpen = true          │
│   isLoading = false     │   │  isLoading = false      │
│   (Popup hidden)        │   │  (Popup visible)        │
└─────────────────────────┘   └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │   USER CLOSES POPUP     │
                              │   isOpen = false        │
                              │   isLoading = false     │
                              │   localStorage = true   │
                              │   (Popup hidden forever)│
                              └─────────────────────────┘
```

---

## localStorage State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIRST TIME VISITOR                           │
│  localStorage.getItem('welcomePopupDismissed') = null           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Check auth     │
                    │ Show popup if  │
                    │ not logged in  │
                    └────────┬───────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLOSES POPUP                            │
│  localStorage.setItem('welcomePopupDismissed', 'true')          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RETURNING VISITOR                            │
│  localStorage.getItem('welcomePopupDismissed') = 'true'         │
│  Popup will NEVER show again (until localStorage cleared)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Call Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    fetch('/api/auth/me')                        │
│                    credentials: 'include'                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Middleware                           │
│                    Check JWT cookie                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Valid JWT        │        │ No JWT or        │
    │ User found       │        │ Invalid JWT      │
    └────────┬─────────┘        └────────┬─────────┘
             │                           │
             ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Return 200 OK    │        │ Return 401       │
    │ {                │        │ {                │
    │   success: true, │        │   error: '...'   │
    │   user: {...}    │        │ }                │
    │ }                │        │                  │
    └────────┬─────────┘        └────────┬─────────┘
             │                           │
             ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ DON'T SHOW POPUP │        │ SHOW POPUP       │
    └──────────────────┘        └──────────────────┘
```

---

## User Journey Map

### Journey 1: New Visitor (Not Logged In)
```
1. Visit website
   ↓
2. Popup appears after 1s
   ↓
3. Choose "I'm a Student"
   ↓
4. Redirect to /auth?type=student
   ↓
5. Sign up / Login
   ↓
6. Popup never shows again (user is now authenticated)
```

### Journey 2: Returning User (Logged In)
```
1. Visit website (already logged in)
   ↓
2. Auth check: User authenticated
   ↓
3. Popup does NOT appear
   ↓
4. User continues browsing
```

### Journey 3: Visitor Who Dismissed Popup
```
1. Visit website
   ↓
2. Popup appears after 1s
   ↓
3. Click close button (X)
   ↓
4. localStorage saves dismissal
   ↓
5. Refresh page
   ↓
6. Popup does NOT appear (localStorage check)
```

### Journey 4: User After Logout
```
1. User logs out
   ↓
2. Visit website
   ↓
3. Auth check: User NOT authenticated
   ↓
4. Popup appears after 1s
   ↓
5. User can sign in again or dismiss
```

---

## Component Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Mount                              │
│                    useEffect() triggered                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              checkAuthAndShowPopup() called                     │
│              Async function starts                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              localStorage check (synchronous)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              API call to /api/auth/me (async)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Response received                                  │
│              State updated (isOpen, isLoading)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Component Re-renders                               │
│              AnimatePresence shows/hides popup                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Timing Diagram

```
Time (ms)    Event
─────────────────────────────────────────────────────────────────
0            Page loads
             Component mounts
             useEffect() runs
             
10           localStorage check completes
             
50           API call sent to /api/auth/me
             
200          API response received
             
200          Decision made: show or hide popup
             
1200         If showing: popup appears (1s delay)
             
1500         Popup animation completes
             
∞            User interacts or popup stays visible
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    API Call to /api/auth/me                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Success          │        │ Error            │
    │ (200 OK)         │        │ (Network/Server) │
    └────────┬─────────┘        └────────┬─────────┘
             │                           │
             ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Parse response   │        │ Catch block      │
    │ Check user data  │        │ triggered        │
    └────────┬─────────┘        └────────┬─────────┘
             │                           │
             ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ User exists      │        │ Assume user is   │
    │ Don't show popup │        │ not logged in    │
    └──────────────────┘        │ Show popup       │
                                │ (fail-safe)      │
                                └──────────────────┘
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (WelcomePopup)                      │
│                    No sensitive data stored                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Call with credentials                    │
│                    Cookie sent automatically                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (/api/auth/me)                       │
│                    Verify JWT from cookie                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Valid JWT        │        │ Invalid/No JWT   │
    │ Return user data │        │ Return 401       │
    └────────┬─────────┘        └────────┬─────────┘
             │                           │
             ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Frontend: Hide   │        │ Frontend: Show   │
    │ popup            │        │ popup            │
    └──────────────────┘        └──────────────────┘
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION STRATEGY                        │
└─────────────────────────────────────────────────────────────────┘

1. localStorage Check First (Fast Path)
   ├─ If dismissed: Skip API call entirely
   └─ Saves network request and server load

2. Single API Call
   ├─ Only one call to /api/auth/me per page load
   └─ No polling or repeated checks

3. Lazy Rendering
   ├─ Popup only renders when isOpen = true
   └─ Saves DOM operations and memory

4. AnimatePresence
   ├─ Smooth animations without blocking
   └─ GPU-accelerated transforms

5. Conditional Rendering
   ├─ No hidden elements in DOM
   └─ Clean component unmount
```

---

## Summary

This flow diagram shows:
- ✅ Complete user journey from page load to popup interaction
- ✅ State transitions and component lifecycle
- ✅ API call flow and error handling
- ✅ localStorage persistence mechanism
- ✅ Security and performance optimizations
- ✅ Timing and event sequence

The popup system is designed to be:
- **User-friendly**: Only shows when needed
- **Performant**: Optimized with localStorage
- **Secure**: Cookie-based auth, no data exposure
- **Reliable**: Graceful error handling
- **Maintainable**: Clear logic flow
