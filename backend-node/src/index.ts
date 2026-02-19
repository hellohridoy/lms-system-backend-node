import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";

import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import borrowRoutes from "./routes/borrowRoutes";
import configRoutes from "./routes/configRoutes";
import reportingRoutes from "./routes/reportingRoutes";
import notificationRoutes from "./routes/notificationRoutes";

dotenv.config();

const app = express();

// Configure CORS to allow requests from your frontend
const allowedOrigins = [
    'http://localhost:4200',
    'https://librarymanagementsystem-eight.vercel.app',
    'https://library-management-system-frontend.vercel.app',
    // Add any other Vercel preview URLs if needed
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Library Management System API'
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/config", configRoutes);
app.use("/api/reports", reportingRoutes);
app.use("/api/notifications", notificationRoutes);

// Initialize Database
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

export default app;

if (require.main === module) {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
