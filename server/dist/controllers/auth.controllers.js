"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = exports.register = exports.logout = exports.login = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const auth_utils_1 = require("../utils/auth.utils");
const math_utils_1 = require("../utils/math.utils");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// @desc   Login user
// @route  POST /auth/login
// @access Public
// @body   { emailUsername: string, passwordLogin: string }
const login = async (req, res) => {
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
    const valid = user ? await bcrypt_1.default.compare(password, user.password) : false;
    if (!user)
        return res.status(401).json({ error: 'not found' });
    if (!valid)
        return res.status(401).send({ error: 'invalid password' });
    await (0, auth_utils_1.setTokenCookies)(res, user.id);
    return res.status(200).json({
        username: user.username,
        fname: user.fname,
        image: user.image
    });
};
exports.login = login;
// @desc   Logout user
// @route  POST /auth/logout
// @access Private
const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.sendStatus(401);
    const { payload } = (0, auth_utils_1.verifyToken)(refreshToken, "refresh");
    if (!payload)
        return res.sendStatus(500);
    const { jti: tokenId } = payload;
    const deletedRefreshToken = prisma.refreshToken.delete({
        where: { id: tokenId }
    });
    if (!deletedRefreshToken)
        res.sendStatus(500);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.sendStatus(200);
};
exports.logout = logout;
// @desc   Register user
// @route  POST /auth/register
// @access Public
// @body   { fname: string, lname: string username: string, dob: string, 
//           email: string, passwordRegister: string, passwordConfirm: string }
const register = async (req, res) => {
    // Name regex
    // 1. Must be between 2 and 50 characters
    // 2. Must only contain letters, spaces, hyphens, and apostrophes
    // 3. Must start and end with a letter
    const nameRegex = /^[\p{Letter}'][ \p{Letter}'-]{0,48}[\p{Letter}]$/u;
    // Username regex
    // 1. Must be between 3 and 20 characters
    // 2. Must only contain alphanumeric characters, periods, hyphens, and underscores
    // 3. Must start with a letter
    // 4. Must end with an alphanumeric character
    // 5. Cannot contain two special characters periods in a row
    const usernameRegex = /^(?!.*[._-]{2}).[a-zA-Z][a-zA-Z0-9_.-]{0,17}[a-zA-Z0-9]$/;
    // Password regex
    // 1. Must be between 8 and 50 characters
    // 2. Must contain at least one uppercase letter
    // 3. Must contain at least one lowercase letter
    // 4. Must contain at least one number
    // 5. Must contain at least one special character
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-+]).{8,50}$/;
    const registerPayload = zod_1.z.object({
        fname: zod_1.z.string().regex(nameRegex),
        lname: zod_1.z.string().regex(nameRegex),
        username: zod_1.z.string().regex(usernameRegex),
        dob: zod_1.z.date().min(new Date("1900-01-01")).max(new Date()),
        email: zod_1.z.string().trim().email().max(320),
        password: zod_1.z.string().regex(passwordRegex),
    });
    const parsedData = registerPayload.safeParse(Object.assign(Object.assign({}, req.body), { dob: new Date(req.body.dob) }));
    if (!parsedData.success)
        return res.sendStatus(400);
    const userData = parsedData.data;
    const hash = await bcrypt_1.default.hash(userData.password, Number(process.env.SALT_ROUNDS));
    try {
        const user = await prisma.user.create({
            data: {
                fname: userData.fname,
                lname: userData.lname,
                username: userData.username,
                dob: userData.dob,
                email: userData.email,
                password: hash,
                image: `conjugo.s3.eu-west-2.amazonaws.com/images/profile/${userData.fname[0].toLowerCase()}-${(0, math_utils_1.randomElement)(['red', 'orange', 'yellow', 'green', 'blue', 'purple'])}.png`
            }
        });
        try {
            await prisma.savedVerbs.create({
                data: { userId: user.id }
            });
        }
        catch (_a) {
            return res.sendStatus(500);
        }
        await (0, auth_utils_1.setTokenCookies)(res, user.id);
        return res.status(201).json({
            username: user.username,
            fname: user.fname,
            image: user.image
        });
    }
    catch (err) {
        if (err.code === 'P2002')
            return res.status(400).json({ field: `${err.meta.target[0]}`, error: 'exists' });
        return res.sendStatus(500);
    }
};
exports.register = register;
// @desc   Acquire token
// @route  POST /auth/token
// @access Public
const token = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.sendStatus(401);
    const { payload, expired } = (0, auth_utils_1.verifyToken)(refreshToken, 'refresh');
    if (!payload)
        return res.sendStatus(500);
    if (expired)
        return res.sendStatus(401);
    const { jti: tokenId, id: userId } = payload;
    const isStored = Boolean(await prisma.refreshToken.findUnique({
        where: { id: tokenId }
    }));
    if (!isStored)
        return res.sendStatus(401);
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user)
        return res.sendStatus(500);
    const newAccessToken = (0, auth_utils_1.createAccessToken)(userId);
    const newRefreshToken = await (0, auth_utils_1.createRefreshToken)(userId);
    const isDeleted = Boolean(await prisma.refreshToken.delete({
        where: { id: tokenId }
    }));
    if (!isDeleted || !newRefreshToken)
        return res.sendStatus(500);
    // Return access token
    res.cookie('accessToken', newAccessToken, {
        maxAge: 3600000,
        httpOnly: true
    });
    res.cookie('refreshToken', newRefreshToken, {
        maxAge: 3.156e+10,
        httpOnly: true
    });
    res.sendStatus(200);
};
exports.token = token;
