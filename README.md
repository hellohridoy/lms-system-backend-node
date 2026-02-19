# Library Management System

A full-stack library management system with Angular frontend and Node.js/Express backend.

## 🚀 Live Demo

- **Frontend**: https://librarymanagementsystem-eight.vercel.app
- **Backend**: https://library-management-system-backend.onrender.com

## 📋 Features

- User authentication (JWT-based)
- Role-based access control (Admin, Librarian, Member, Guest)
- Book catalog management
- Multi-level book borrowing approval workflow
- Fine management system
- Notification system
- Dashboard with statistics
- Reporting and export capabilities

## 🛠️ Tech Stack

**Frontend:**
- Angular 21 (Standalone Components)
- Tailwind CSS
- RxJS

**Backend:**
- Node.js + Express
- TypeORM
- PostgreSQL
- JWT Authentication

## 📦 Installation

### Backend Setup

```bash
cd backend-node
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

## 🌐 Deployment

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set environment variables:
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`
   - `PORT=8080`
5. Build command: `npm install && npm run build`
6. Start command: `node dist/index.js`

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project on Vercel
3. Set root directory to `frontend`
4. Update `frontend/src/environments/environment.prod.ts` with your backend URL
5. Deploy

## 🔧 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:4200` (development)
- `https://librarymanagementsystem-eight.vercel.app` (production)

To add more origins, edit `backend-node/src/index.ts`

## 👥 Default Users

After seeding the database, you can login with:
- Admin: Check your DataSeeder configuration
- Member: Register through the signup page

## 📝 License

MIT
