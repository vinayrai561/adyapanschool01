# Quick Start Guide - Authentication System

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation
- `@prisma/client` - Database ORM
- `zod` - Schema validation
- `axios` - HTTP client
- `framer-motion` - Animations

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/adyapan_skills_passport"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing the Authentication System

### 1. Test Student Signup

1. Go to `http://localhost:3000/auth`
2. Select "For Students" (default)
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
4. Check the "I agree to..." checkboxes
5. Click "Start My Journey"
6. You should be redirected to `/dashboard/student`

### 2. Test Organization Signup

1. Go to `http://localhost:3000/auth`
2. Select "For Organizations"
3. Fill in the form:
   - Full Name: Jane Smith
   - Company Name: Tech Corp
   - Email: jane@techcorp.com
   - Password: password123
   - Confirm Password: password123
4. Check the "I agree to..." checkboxes
5. Click "Start Hiring Talent"
6. You should be redirected to `/dashboard/company`

### 3. Test Login

1. Go to `http://localhost:3000/auth`
2. Click "Sign In" link at the bottom
3. Enter email and password from signup
4. Click "Sign In"
5. You should be redirected to appropriate dashboard

### 4. Test Logout

1. On the dashboard, click the "Logout" button
2. You should be redirected to home page

### 5. Test Forgot Password

1. Go to `http://localhost:3000/auth/forgot-password`
2. Enter your email
3. Click "Send Reset Link"
4. In development mode, the reset token is returned in the response
5. Copy the token and go to `http://localhost:3000/auth/reset-password?token=<token>`
6. Enter new password and confirm
7. Click "Reset Password"
8. You should see success message and be redirected to login

### 6. Test Protected Routes

1. Logout from dashboard
2. Try to access `http://localhost:3000/dashboard/student`
3. You should be redirected to `/auth`

## API Endpoints Reference

### Signup
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

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout
```

### Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token",
    "password": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

## File Locations

### Backend API Routes
- `src/app/api/auth/signup/route.ts` - User registration
- `src/app/api/auth/login/route.ts` - User login
- `src/app/api/auth/me/route.ts` - Get current user
- `src/app/api/auth/logout/route.ts` - User logout
- `src/app/api/auth/forgot-password/route.ts` - Request password reset
- `src/app/api/auth/reset-password/route.ts` - Reset password

### Frontend Pages
- `src/app/auth/page.tsx` - Sign up / Sign in page
- `src/app/auth/forgot-password/page.tsx` - Forgot password page
- `src/app/auth/reset-password/page.tsx` - Reset password page
- `src/app/dashboard/student/page.tsx` - Student dashboard
- `src/app/dashboard/company/page.tsx` - Company dashboard

### Utilities
- `src/hooks/useAuth.ts` - Authentication hook
- `src/context/AuthContext.tsx` - Authentication context
- `src/lib/auth.ts` - Authentication utilities

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: 
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Issue: "JWT_SECRET not set"
**Solution**: 
- Add JWT_SECRET to .env file
- Use a strong, random string (min 32 characters)

### Issue: "Cookies not being set"
**Solution**: 
- In development, cookies work with localhost
- In production, ensure HTTPS is enabled
- Check browser cookie settings

### Issue: "Build fails with TypeScript errors"
**Solution**: 
- Run `npm install` to ensure all dependencies are installed
- Run `npm run db:generate` to generate Prisma types
- Clear `.next` folder and rebuild

### Issue: "Password reset token expired"
**Solution**: 
- Tokens expire after 1 hour
- Request a new password reset
- In development, tokens are returned in response

## Development Tips

### 1. Using Prisma Studio
```bash
npm run db:studio
```
Opens a visual database browser at `http://localhost:5555`

### 2. Viewing Logs
Check browser console for frontend errors
Check terminal for backend errors

### 3. Testing with Different User Types
- Use different emails for student and organization accounts
- Test both signup flows
- Verify role-based redirects work correctly

### 4. Debugging Authentication
- Check browser DevTools → Application → Cookies for authToken
- Check Network tab to see API requests/responses
- Use console.log in API routes for debugging

## Next Steps

1. **Email Integration**
   - Set up email service (SendGrid, Mailgun, etc.)
   - Send password reset emails
   - Send welcome emails

2. **Google OAuth**
   - Get Google OAuth credentials
   - Implement OAuth flow
   - Add Google Sign-In button

3. **Production Deployment**
   - Set strong JWT_SECRET
   - Configure production database
   - Enable HTTPS
   - Set up monitoring

4. **Additional Features**
   - Email verification
   - Two-factor authentication
   - Social login
   - Profile management

## Documentation

For detailed information, see:
- `AUTHENTICATION_GUIDE.md` - Complete authentication guide
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Implementation details

## Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check browser console for errors
4. Check terminal for backend errors
5. Verify environment variables are set correctly

## Build & Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

---

**Happy coding! 🚀**
