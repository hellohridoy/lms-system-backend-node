# 🏗️ System Architecture

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                  https://librarymanagementsystem-            │
│                      eight.vercel.app                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS Requests
                         │ (with JWT token)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Angular Application                        │ │
│  │  • Standalone Components                               │ │
│  │  • Tailwind CSS                                        │ │
│  │  • RxJS for state management                           │ │
│  │  • HTTP Interceptor (adds JWT to requests)             │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │ /api/auth/*, /api/books/*, etc.
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   RENDER (Backend)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Express.js Server                          │ │
│  │  • CORS Middleware (validates origin)                  │ │
│  │  • JWT Middleware (validates token)                    │ │
│  │  • Route Controllers                                   │ │
│  │  • TypeORM (database ORM)                              │ │
│  └────────────────────────┬───────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────┘
                             │
                             │ SQL Queries
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              RENDER PostgreSQL Database                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tables:                                               │ │
│  │  • users                                               │ │
│  │  • books                                               │ │
│  │  • borrow_requests                                     │ │
│  │  • user_notifications                                  │ │
│  │  • system_config                                       │ │
│  │  • password_reset_tokens                               │ │
│  │  • book_tags                                           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. User Login Flow

```
User enters credentials
        ↓
Angular AuthService.login()
        ↓
POST /api/auth/signin
        ↓
Express AuthController.signin()
        ↓
Validate credentials (bcrypt)
        ↓
Generate JWT token
        ↓
Return token + user data
        ↓
Store in localStorage
        ↓
Redirect to dashboard
```

### 2. Book Request Flow

```
User clicks "Request Book"
        ↓
Angular BorrowService.requestBook()
        ↓
HTTP Interceptor adds JWT token
        ↓
POST /api/borrows/request/:bookId
        ↓
JWT Middleware validates token
        ↓
Extract user from token
        ↓
Check borrowing limit
        ↓
Check book availability
        ↓
Create borrow request (PENDING_LIBRARIAN)
        ↓
Create notification for librarian
        ↓
Return success response
        ↓
Update UI
```

### 3. CORS Validation Flow

```
Browser sends preflight OPTIONS request
        ↓
CORS Middleware checks origin
        ↓
Is origin in allowedOrigins?
   ├─ YES → Allow request
   │         ↓
   │    Add CORS headers
   │         ↓
   │    Process request
   │
   └─ NO → Reject request
            ↓
       Return CORS error
            ↓
       Browser blocks response
```

## Data Models

### User
```typescript
{
  id: number
  username: string (unique)
  email: string (unique)
  password: string (hashed)
  role: ADMIN | LIBRARIAN | MEMBER | GUEST
  status: ACTIVE | INACTIVE | PENDING_APPROVAL
  borrowingLimit: number
  fullName: string
  phoneNumber: string
  address: string
  registrationDate: Date
}
```

### Book
```typescript
{
  id: number
  title: string
  author: string
  isbn: string
  genre: string
  synopsis: string
  coverUrl: string
  totalCopies: number
  availableCopies: number
  publicationYear: number
  tags: string[]
}
```

### BorrowRequest
```typescript
{
  id: number
  user: User
  book: Book
  status: PENDING_LIBRARIAN | PENDING_ADMIN | 
          APPROVED | REJECTED | RETURNED | OVERDUE
  requestDate: Date
  approvalDate: Date
  dueDate: Date
  returnDate: Date
  fineAmount: number
  isRenewal: boolean
  finePaid: boolean
}
```

## Security Layers

### Layer 1: CORS (Origin Validation)
```
Browser → CORS Middleware
         ↓
    Check origin
         ↓
    Allow/Deny
```

### Layer 2: JWT Authentication
```
Request → JWT Middleware
         ↓
    Extract token
         ↓
    Verify signature
         ↓
    Check expiration
         ↓
    Extract user info
```

### Layer 3: Role-Based Authorization
```
Request → Authorization Middleware
         ↓
    Check user role
         ↓
    Compare with required roles
         ↓
    Allow/Deny
```

## Environment Configuration

### Development
```
Frontend: http://localhost:4200
Backend:  http://localhost:8080
Database: localhost:5432
```

### Production
```
Frontend: https://librarymanagementsystem-eight.vercel.app
Backend:  https://your-backend.onrender.com
Database: Render PostgreSQL (internal)
```

## API Endpoints

### Public Endpoints (No Auth Required)
```
POST   /api/auth/signin
POST   /api/auth/signup
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /health
```

### Protected Endpoints (Auth Required)
```
GET    /api/books
GET    /api/books/:id
GET    /api/books/genres
POST   /api/borrows/request/:bookId
GET    /api/borrows/my
GET    /api/borrows/my-history
GET    /api/notifications
```

### Admin/Librarian Only
```
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
GET    /api/borrows (all requests)
PUT    /api/borrows/:id/review
PUT    /api/borrows/:id/approve
GET    /api/reports/*
```

## Technology Stack

### Frontend
- **Framework**: Angular 21
- **Styling**: Tailwind CSS
- **State Management**: RxJS + Services
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Build Tool**: Angular CLI
- **Hosting**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Express validators
- **Hosting**: Render

### Database
- **Type**: PostgreSQL
- **ORM**: TypeORM
- **Migrations**: TypeORM migrations
- **Hosting**: Render PostgreSQL

## Scaling Considerations

### Current Setup (Free Tier)
- Backend spins down after 15 min inactivity
- First request takes 30-60 seconds
- Suitable for development/demo

### Production Recommendations
1. Upgrade Render to paid tier (always-on)
2. Enable database connection pooling
3. Add Redis for session management
4. Implement rate limiting
5. Add CDN for static assets
6. Set up monitoring (Sentry, LogRocket)
7. Implement automated backups
8. Add load balancer for high traffic
