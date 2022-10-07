import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken;

        const { payload, expired }  = verifyToken(token as string, 'access')

        if (!payload) {
            if (expired) 
                return res.status(401).send('token expired')
            
            return res.status(401).send('invalid token')
        }

        req.body.user = await prisma.user.findUnique({
            where: { id: payload?.id }
        })

        next()
    }

    catch {
        return res.status(500).send('server error')
    }
}