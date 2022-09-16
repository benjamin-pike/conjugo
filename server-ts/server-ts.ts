import express from 'express';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';

dotenv.config()

const port = process.env.PORT
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./src/static'))
app.use(cors())

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!');
})

app.use('/learn', require('./routes/learnRoutes'))
app.use('/practice', require('./routes/practiceRoutes'))
app.use('/reference', require('./routes/referenceRoutes'))