# Adyapan Authentication System Guide

## Overview

This document describes the complete production-ready authentication system implemented for the Adyapan platform. The system supports two user types: Students and Organizations (Companies).

## Tech Stack

- **Frontend**: React (Next.js 14) + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **HTTP Security**: HTTP-only cookies

## Features

### 1. User Registration (Signup)
- **Endpoint**: `POST /api/auth/signup`
- **Supported User Types**:
  - Students: First Name, Last Name, Email, Password
  - Organizations: Full Name, Company Name, Email, Password
- **Validation**:
  - Email format validation
  - Password minimum 6 characters
  - Confirm password match
  - Duplicate email prevention
- **Response**: JWT token + HTTP-only cookie + User data

### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Fields**: Email, Password
- **Validation**:
  - Email format check
  - Password verification with bcrypt
- **Response**: JWT token + HTTP-only cookie + User data
- **Redirect**: 
  - Students → `/dashboard/student`
  - Organizations → `/dashboard/company`

### 3. Get Current User (Protected Route)
- **Endpoint**: `GET /api/auth/me`
- **Authentication**: Required (JWT token from cookie or Authorization header)
- **Response**: Current user data with profile information
- **Error**: 401 Unauthorized if token is invalid or missing

### 4. Logout
- **Endpoint**: `POST /api/auth/logout`
- **Action**: Clears HTTP-only auth cookie
- **Response**: Success message
- **Redirect**: Home page

### 5. Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Fields**: Email
- **Action**: Generates password reset token (valid for 1 hour)
- **Response**: Success message (doesn't reveal if email exists for security)
- **Note**: In production, should send email with reset link

### 6. Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Fields**: Token, New Password, Confirm Password
- **Validation**:
  - Token validity and expiration
  - Password minimum 6 characters
  - Confirm password match
- **Action**: Updates user password with bcrypt hash
- **Response**: Success message

## API Endpoints

### Authentication Routes

```
POST   /api/auth/signup              - Register new user
POST   /api/auth/login               - Login user
GET    /api/auth/me                  - Get current user (protected)
POST   /api/auth/logout              - Logout user
POST   /api/auth/forgot-password     - Request password reset
POST   /api/auth/reset-password      - Reset password with token
```

## Frontend Pages

### Public Pages
- `/auth` - Sign Up / Sign In page with user type toggle
- `/auth/forgot-password` - Forgot password request page
- `/auth/reset-password?token=...` - Password reset page

### Protected Pages
- `/dashboard/student` - Student dashboard
- `/dashboard/company` - Company/Organization dashboard

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  role          UserRole  @default(STUDENT)  // STUDENT | COMPANY | ADMIN
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  studentProfile StudentProfile?
  companyProfile CompanyProfile?
  // ... other relations
}

enum UserRole {
  STUDENT
  COMPANY
  ADMIN
}
```

### StudentProfile Model
```prisma
model StudentProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  bio         String?
  location    String?
  education   Json?
  experience  Json?
  careerGoals String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### CompanyProfile Model
```prisma
model CompanyProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  companyName String
  industry    String?
  size        String?
  website     String?
  description String?
  logoUrl     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Security Features

### 1. Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Minimum 6 characters required

### 2. Token Security
- JWT tokens with 7-day expiration
- Stored in HTTP-only cookies (not accessible via JavaScript)
- Secure flag set in production
- SameSite=Lax to prevent CSRF attacks

### 3. Route Protection
- Protected routes verify JWT token
- Token validation on every request
- Automatic redirect to login if unauthorized

### 4. Email Security
- Duplicate email prevention
- Email format validation
- Forgot password doesn't reveal if email exists

### 5. CORS & Headers
- Proper CORS configuration
- Secure headers set by Next.js

## Environment Variables

Required environment variables in `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/adyapan_skills_passport"

# Authentication
JWT_SECRET="your-jwt-secret-key-here-min-32-chars"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"  # or "production"
```

## Frontend Hooks & Context

### useAuth Hook
```typescript
const {
  user,           // Current user object or null
  loading,        // Loading state
  error,          // Error message or null
  isAuthenticated,// Boolean
  login,          // (email, password) => Promise<void>
  signup,         // (data) => Promise<void>
  logout,         // () => Promise<void>
  clearError,     // () => void
} = useAuth();
```

### AuthContext
Provides global authentication state to entire app:
```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

## Usage Examples

### Signup (Student)
```typescript
const { signup } = useAuth();

await signup({
  role: 'student',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
});
```

### Signup (Organization)
```typescript
const { signup } = useAuth();

await signup({
  role: 'organization',
  fullName: 'Jane Smith',
  companyName: 'Tech Corp',
  email: 'jane@techcorp.com',
  password: 'password123',
  confirmPassword: 'password123',
});
```

### Login
```typescript
const { login } = useAuth();

await login('user@example.com', 'password123');
```

### Logout
```typescript
const { logout } = useAuth();

await logout();
```

### Get Current User
```typescript
const { user, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log('User:', user.name, user.role);
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid email or password" | Wrong credentials | Check email and password |
| "Email already registered" | Duplicate email | Use different email or login |
| "Passwords don't match" | Confirm password mismatch | Ensure passwords match |
| "Password must be at least 6 characters" | Password too short | Use longer password |
| "Unauthorized - No token provided" | Missing auth token | Login first |
| "Unauthorized - Invalid token" | Expired or invalid token | Login again |
| "Invalid or expired reset token" | Token expired or invalid | Request new password reset |

## Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: authToken=<your-token>"
```

**Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: authToken=<your-token>"
```

## Deployment Checklist

- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `NEXTAUTH_URL` to production domain
- [ ] Set up PostgreSQL database
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Enable HTTPS in production
- [ ] Set secure cookies (automatic in production)
- [ ] Configure email service for password reset emails
- [ ] Set up monitoring and logging
- [ ] Test all authentication flows
- [ ] Set up backup and recovery procedures

## Future Enhancements

1. **Google OAuth Integration**
   - Add Google Sign-In button
   - Implement OAuth flow
   - Link OAuth accounts to existing users

2. **Email Verification**
   - Send verification email on signup
   - Verify email before account activation
   - Resend verification email option

3. **Two-Factor Authentication (2FA)**
   - SMS or authenticator app support
   - Backup codes for recovery

4. **Social Login**
   - LinkedIn OAuth for professionals
   - GitHub OAuth for developers

5. **Session Management**
   - Multiple device login tracking
   - Session revocation
   - Login history

6. **Advanced Security**
   - Rate limiting on auth endpoints
   - IP whitelisting
   - Suspicious activity detection
   - Account lockout after failed attempts

7. **Profile Management**
   - Update profile information
   - Change password
   - Delete account

## Support & Troubleshooting

### Common Issues

**Issue**: "Cannot find module 'bcrypt'"
- **Solution**: Run `npm install bcrypt`

**Issue**: "JWT_SECRET not set"
- **Solution**: Add `JWT_SECRET` to `.env` file

**Issue**: "Database connection failed"
- **Solution**: Check `DATABASE_URL` and ensure PostgreSQL is running

**Issue**: "Cookies not being set"
- **Solution**: Ensure `NODE_ENV=production` for secure cookies, or use `secure: false` in development

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── signup/route.ts
│   │       ├── login/route.ts
│   │       ├── me/route.ts
│   │       ├── logout/route.ts
│   │       ├── forgot-password/route.ts
│   │       └── reset-password/route.ts
│   ├── auth/
│   │   ├── page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── dashboard/
│       ├── student/page.tsx
│       └── company/page.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
└── lib/
    └── auth.ts
```

## References

- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Zod Validation](https://zod.dev/)
