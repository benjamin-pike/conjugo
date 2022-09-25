import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken'; 
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken, verifyToken } from '../utils/auth.utils';

dotenv.config()
const prisma = new PrismaClient();

// @desc   Login user
// @route  POST /auth/login
// @access Public
const login = async (req: Request, res: Response) => {
    const { emailUsername: identifier, passwordLogin: password } = req.body;

    if (!identifier || !password) {
        return res.status(400).send('invalid input');
    }

    const identifierType = identifier.includes('@') ? 'email' : 'username';

    const user = await prisma.user.findUnique({
        where: {
            [identifierType]: identifier
        }
    });

    const valid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !valid) return res.status(401).send('invalid credentials');

    const accessToken = createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);

    if (!refreshToken) return res.status(500).send('server error');

    res.cookie('accessToken', accessToken, { 
        maxAge: 3600000, // 1 hour 
        httpOnly: true 
    });

    res.cookie('refreshToken', refreshToken, { 
        maxAge: 3.156e+10, // 1 year
        httpOnly: true 
    });

    return res.status(200).json({
        username: user.username,
        fname: user.fname,
        image: user.image
    });
}

// @desc   Register user
// @route  POST /auth/register
// @access Public
const register = async (req: Request<{}, {}, { [key: string]: string }>, res: Response) => {
    const { 
        fname, 
        lname, 
        username, 
        dob, 
        email, 
        passwordRegister, 
        passwordConfirm 
    } = req.body;

    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passwordRequired = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-+]).{0,}$/
    const passwordValid = /^[a-zA-Z0-9#?!@$%^&*\-+]+$/

    let status = 500;
    let message = 'server error';

    try {

        const valid = 
            // Check if all fields are filled
            !fname || !lname || !username || !dob || !email || !passwordRegister || !passwordConfirm  ||
            
            // Check all fields are filled after trimming whitespace
            Object.values(req.body).some( value => value.trim().length === 0 ) ||
            
            // Check array of field-specific conditions – if any are false, form is invalid
            [ 
                // First name
                /^[A-Za-z]+$/.test(fname), // Check for invalid characters
                fname.trim().length <= 32, // Check length is less than or equal to 32 characters
                
                // Last name
                /^[A-Za-z]+$/.test(lname), // Check for invalid characters
                lname.trim().length <= 32, // Check length is less than or equal to 32 characters
                
                // Username
                /^[A-Za-z0-9_\-\.]+$/.test(username),  // Check for invalid characters
                /^[A-za-z].*/.test(username), // Check for invalid first character
                /^.*[A-za-z0-9]$/.test(username), // Check for invalid last character
                !/^!?.*[_\-\.]{2}.*$/.test(username), // Check for invalid consecutive characters
                username.trim().length <= 32, // Check length is less than or equal to 32 characters
                username.trim().length > 6, // Check length is greater than or equal to 6 characters
                
                // Date of birth
                /^\d{4}-\d{2}-\d{2}$/.test(dob), // Check date is in YYYY-MM-DD format
                Date.parse(dob) > Date.parse("1900-01-01"), // Check date is after 1900
                Date.parse(dob) < (new Date()).getTime(), // Check date is before today
                
                // Email
                emailPattern.test(email), // Check for invalid email
                
                // Password
                passwordRequired.test(passwordRegister), // Check for required characters
                passwordValid.test(passwordRegister), // Check for invalid characters
                passwordRegister.length >= 8, // Check length is greater than or equal to 8 characters
                passwordRegister === passwordConfirm // Check password and password confirmation match
            ].every( (condition: boolean) => condition === true ) // Check all conditions are met

        if (!valid) throw new Error('invalid input')

        // If valid input, attempt to create user
        const hash = await bcrypt.hash(passwordRegister, Number(process.env.SALT_ROUNDS));

        const user = await prisma.user.create({
            data: {
                fname,
                lname,
                username,
                email,
                dob: new Date(dob),
                password: hash,
                image: "",
            }
        });

        await prisma.savedVerbs.create({
            data: { userId: user.id }
        });

        status = 201;
        message = 'User created';
    }

    catch (err: any) {
        if (err.code === 'P2002') {
            message = `${err.meta.target[0]} already exists`;
            status = 400;
        }

        else if (err.message === 'invalid input') {
            message = 'invalid input';
            status = 400;
        }

        else console.log(err)
    }
    
    res.status(status).send(message);
}

// @desc   Acquire token
// @route  POST /auth/token
// @access Public
const token = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).send('no refresh token');

    const {payload, expired} = verifyToken(refreshToken, 'refresh')

    if (!payload) return res.status(500).send('sever error');
    if (expired) return res.status(401).send('token expired');

    const verifiedToken = payload as JwtPayload
    const { jti: tokenId, id: userId } = verifiedToken;

    const isStored = Boolean(await prisma.refreshToken.findUnique({
        where: { id: tokenId }
    }));

    if (!isStored) return res.status(401).send('invalid refresh token');

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) return res.status(500).send('sever error');

    const newAccessToken = createAccessToken(userId);
    const newRefreshToken = await createRefreshToken(userId);

    const isDeleted = Boolean(await prisma.refreshToken.delete({
        where: { id: tokenId }
    }))

    if (!isDeleted || !newRefreshToken) return res.status(500).send('server error');

    // Return access token
    res.cookie('aceessToken', newAccessToken, {
        maxAge: 3600000, // 1 hour
        httpOnly: true
    })

    res.cookie('refreshToken', newRefreshToken, {
        maxAge: 3.156e+10, // 1 year
        httpOnly: true
    })

    res.status(200).send('token refreshed');
}

export { login, register, token }