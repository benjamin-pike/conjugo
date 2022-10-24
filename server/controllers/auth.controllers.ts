import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken'; 
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { createAccessToken, createRefreshToken, verifyToken, setTokenCookies } from '../utils/auth.utils';
import { randomElement } from '../utils/math.utils';

dotenv.config()
const prisma = new PrismaClient();

// @desc   Login user
// @route  POST /auth/login
// @access Public
// @body   { emailUsername: string, passwordLogin: string }
export const login = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'invalid input' });
    }

    const identifierType = identifier.includes('@') ? 'email' : 'username';

    const user = await prisma.user.findUnique({
        where: {
            [identifierType]: identifier
        }
    });

    const valid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user) return res.status(401).json({ error: 'not found' });
    if (!valid) return res.status(401).send({ error: 'invalid password' });

    await setTokenCookies(res, user.id);

    return res.status(200).json({
        username: user.username,
        fname: user.fname,
        image: user.image
    })
}

// @desc   Logout user
// @route  POST /auth/logout
// @access Private
export const logout = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) return res.sendStatus(401);

	const { payload } = verifyToken(refreshToken, "refresh");

	if (!payload) return res.sendStatus(500);

	const { jti: tokenId } = payload as JwtPayload;

	const deletedRefreshToken = prisma.refreshToken.delete({
		where: { id: tokenId }
	});

	if (!deletedRefreshToken) res.sendStatus(500);

	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	res.sendStatus(200);
};

// @desc   Register user
// @route  POST /auth/register
// @access Public
// @body   { fname: string, lname: string username: string, dob: string, 
//           email: string, passwordRegister: string, passwordConfirm: string }
export const register = async (req: Request<{}, {}, { [key: string]: string }>, res: Response) => {
    // Name regex
        // 1. Must be between 2 and 50 characters
        // 2. Must only contain letters, spaces, hyphens, and apostrophes
        // 3. Must start and end with a letter
    const nameRegex = /^[\p{Letter}'][ \p{Letter}'-]{0,48}[\p{Letter}]$/u
    
    // Username regex
        // 1. Must be between 3 and 20 characters
        // 2. Must only contain alphanumeric characters, periods, hyphens, and underscores
        // 3. Must start with a letter
        // 4. Must end with an alphanumeric character
        // 5. Cannot contain two special characters periods in a row
    const usernameRegex = /^(?!.*[._-]{2}).[a-zA-Z][a-zA-Z0-9_.-]{0,17}[a-zA-Z0-9]$/
    
    // Password regex
        // 1. Must be between 8 and 50 characters
        // 2. Must contain at least one uppercase letter
        // 3. Must contain at least one lowercase letter
        // 4. Must contain at least one number
        // 5. Must contain at least one special character
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-+]).{8,50}$/

    const registerPayload = z.object({
        fname: z.string().regex(nameRegex),
        lname: z.string().regex(nameRegex),
        username: z.string().regex(usernameRegex),
        dob: z.date().min(new Date("1900-01-01")).max(new Date()),
        email: z.string().trim().email().max(320),
        password: z.string().regex(passwordRegex),
    });

    const parsedData = registerPayload.safeParse({...req.body, dob: new Date(req.body.dob)});

    if (!parsedData.success) return res.sendStatus(400);

    const userData = parsedData.data

    const hash = await bcrypt.hash(userData.password, Number(process.env.SALT_ROUNDS));

    try {
        const user = await prisma.user.create({
            data: {
                fname: userData.fname,
                lname: userData.lname,
                username: userData.username,
                dob: userData.dob,
                email: userData.email,
                password: hash,
                image: `${userData.fname[0].toLowerCase()}-${
                    randomElement(['red', 'orange', 'yellow', 'green', 'blue', 'purple'])
                }.png`
            }
        })

        try {
            await prisma.savedVerbs.create({ // Create 'saved verbs' entry for user
                data: { userId: user.id }
            });
        } 

        catch { return res.sendStatus(500) }

        await setTokenCookies(res, user.id);

        return res.status(201).json({
            username: user.username,
            fname: user.fname,
            image: user.image
        })
    }

    catch (err: any) {
        if (err.code === 'P2002')
            return res.status(400).json({ field: `${err.meta.target[0]}`, error: 'exists' })

        return res.sendStatus(500)
    }
}

// @desc   Acquire token
// @route  POST /auth/token
// @access Public
export const token = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401);

    const {payload, expired} = verifyToken(refreshToken, 'refresh')

    if (!payload) return res.sendStatus(500);
    if (expired) return res.sendStatus(401);

    const { jti: tokenId, id: userId } = payload as JwtPayload;

    const isStored = Boolean(await prisma.refreshToken.findUnique({
        where: { id: tokenId }
    }));

    if (!isStored) return res.sendStatus(401);

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) return res.sendStatus(500);

    const newAccessToken = createAccessToken(userId);
    const newRefreshToken = await createRefreshToken(userId);

    const isDeleted = Boolean(await prisma.refreshToken.delete({
        where: { id: tokenId }
    }))

    if (!isDeleted || !newRefreshToken) return res.sendStatus(500);

    // Return access token
    res.cookie('accessToken', newAccessToken, {
        maxAge: 3600000, // 1 hour
        httpOnly: true
    })

    res.cookie('refreshToken', newRefreshToken, {
        maxAge: 3.156e+10, // 1 year
        httpOnly: true
    })

    res.sendStatus(200);
}