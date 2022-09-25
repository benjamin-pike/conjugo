import jwt, { Jwt } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import cuid from 'cuid';

const prisma = new PrismaClient();

export const createAccessToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_ACCESS,
    });
}

export const createRefreshToken = async (id: string) => {
    const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_REFRESH,
        jwtid: cuid()
    });

    const decodedTokenData = jwt.decode(token) as JwtPayload;

    if (!decodedTokenData) return null;

    const savedTokenData = await prisma.refreshToken.create({
        data: {
            id: decodedTokenData.jti as string,
            exp: new Date(decodedTokenData.exp as number * 1000),
            userId: id
        }
    })

    if (!savedTokenData) return null;

    return token;
}

export const verifyToken = (token: string, tokenType: 'access' | 'refresh') => {
    const secret = tokenType === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;

    try {
        const decodedData = jwt.verify(token, secret)
        return { payload: decodedData as JwtPayload, expired: false }
    } 
    
    catch (err: any) {
        return { payload: null, expired: err.name === 'TokenExpiredError' }
    }
}