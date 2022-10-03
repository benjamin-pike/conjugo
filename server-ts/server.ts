import express from 'express';
import { Request, Response } from 'express';
import checkAuth from './middleware/auth.middleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoutes from './routes/auth.routes'
import learnRoutes from './routes/learn.routes'
import practiceRoutes from './routes/practice.routes'
import referenceRoutes from './routes/reference.routes'

import { getUser } from './controllers/user.controllers';

dotenv.config() // Configure environment variables

const port = process.env.PORT || 7000; // Set port
const app = express(); // Create express app

app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded bodies
app.use(express.static('./src/static')) // Serve static files
app.use(cookieParser()) // Parse cookies
app.use(cors()) // Enable CORS

app.listen(port, () => { // Log to console when server starts
    console.log(`Server is listening on port ${port}`);
})

app.use('/api', checkAuth) // Check authentication for all routes under /api

app.get('/api', async (_req: Request, res: Response) => { // Test route
    res.send('Hello World!');
})

app.use('/auth', authRoutes) // Routes for authentication
app.use('/api/learn', learnRoutes) // Routes for 'learn' section
app.use('/api/practice', practiceRoutes) // Routes for 'practice' section
app.use('/api/reference', referenceRoutes) // Routes for 'reference' section

app.get('/api/user', getUser) // Get user data