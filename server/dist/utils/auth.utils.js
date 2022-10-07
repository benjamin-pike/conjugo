"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookies = exports.verifyToken = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const cuid_1 = __importDefault(require("cuid"));
const prisma = new client_1.PrismaClient();
const createAccessToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.NODE_ENV === 'production'
            ? process.env.JWT_EXPIRATION_ACCESS : '1yr'
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = async (id) => {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_REFRESH,
        jwtid: (0, cuid_1.default)()
    });
    const decodedTokenData = jsonwebtoken_1.default.decode(token);
    if (!decodedTokenData)
        return null;
    const savedTokenData = await prisma.refreshToken.create({
        data: {
            id: decodedTokenData.jti,
            exp: new Date(decodedTokenData.exp * 1000),
            userId: id
        }
    });
    if (!savedTokenData)
        return null;
    return token;
};
exports.createRefreshToken = createRefreshToken;
const verifyToken = (token, tokenType) => {
    const secret = tokenType === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
    try {
        const decodedData = jsonwebtoken_1.default.verify(token, secret);
        return { payload: decodedData, expired: false };
    }
    catch (err) {
        return { payload: null, expired: err.name === 'TokenExpiredError' };
    }
};
exports.verifyToken = verifyToken;
const setTokenCookies = async (res, userId) => {
    const accessToken = (0, exports.createAccessToken)(userId);
    const refreshToken = await (0, exports.createRefreshToken)(userId);
    if (!refreshToken)
        return res.sendStatus(500);
    res.cookie('accessToken', accessToken, {
        maxAge: process.env.NODE_ENV === 'production'
            ? 3600000 : 3.156e+10,
        httpOnly: true
    });
    res.cookie('refreshToken', refreshToken, {
        maxAge: 3.156e+10,
        httpOnly: true
    });
};
exports.setTokenCookies = setTokenCookies;
