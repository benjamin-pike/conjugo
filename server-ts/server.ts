import express from 'express';
import { Request, Response, NextFunction } from 'express';
import checkAuth from './middleware/check-auth';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';

dotenv.config()

const port = process.env.PORT
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./src/static'))
app.use(cookieParser())
app.use(cors())

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

app.use('/api', checkAuth)

app.get('/api', async (req: Request, res: Response) => {
    res.send('Hello World!');
})

app.use('/auth', require('./routes/authRoutes'))
app.use('/api/learn', require('./routes/learnRoutes'))
app.use('/api/practice', require('./routes/practiceRoutes'))
app.use('/api/reference', require('./routes/referenceRoutes'))
