# Adyapan EdTech Platform

A modern, full-stack EdTech platform built with Next.js, featuring comprehensive authentication, dynamic content, and professional UI/UX design.

## 🚀 Features

### 🔐 **Authentication System**
- Complete user authentication with JWT tokens
- Secure password hashing with bcrypt
- HTTP-only cookies for enhanced security
- Protected routes and middleware
- Password reset functionality
- Role-based access (Students & Organizations)

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Professional dark/light theme variations
- Interactive components and micro-interactions
- Background video integration
- Mobile-first approach

### 📱 **Pages & Features**
- **Home Page**: Hero section with dynamic content
- **About Us**: Company story with founder profiles
- **Company Pages**: Dedicated B2B experience
- **Campus Ambassador**: Professional recruitment program
- **Authentication**: Login/Signup with form validation
- **Dashboard**: User-specific content areas

### 🛠 **Technical Stack**
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: JWT, bcrypt, HTTP-only cookies
- **Database**: Prisma ORM (ready for PostgreSQL/MySQL)
- **Deployment**: Vercel-ready configuration

## 🏗 **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── auth/              # Authentication pages
│   ├── about/             # About Us pages
│   ├── company/           # Company-specific pages
│   └── dashboard/         # User dashboards
├── components/            # Reusable UI components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/adyapan-edtech-platform.git
   cd adyapan-edtech-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=your-database-connection-string
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🔧 **Configuration**

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

### Authentication Configuration
The platform uses JWT-based authentication with the following features:
- Secure password hashing
- HTTP-only cookie storage
- Automatic token refresh
- Role-based access control

## 🎯 **Key Features Implemented**

### ✅ **Authentication System**
- [x] User registration and login
- [x] JWT token management
- [x] Password reset functionality
- [x] Protected routes
- [x] Role-based access

### ✅ **UI/UX Design**
- [x] Responsive design
- [x] Dark/Light theme support
- [x] Smooth animations
- [x] Professional layouts
- [x] Interactive components

### ✅ **Content Management**
- [x] Dynamic page content
- [x] Company profiles
- [x] User dashboards
- [x] Campus ambassador program

## 🚀 **Deployment**

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 **Team**

- **Sai Charan** - Founder
- **Niranjan Reddy** - Co-Founder
- **Dr. Dhiraj Singh** - Head, Training & Placement Cell
- **Gunjan Avasthi** - Human Resource Manager

## 📞 **Contact**

For any inquiries about this project:
- Website: [Adyapan EdTech Platform](https://your-domain.com)
- Email: contact@adyapan.com

---

**Built with ❤️ by the Adyapan Team**"# adyapanschool1" 
