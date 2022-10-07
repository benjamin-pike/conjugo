"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_utils_1 = require("../utils/auth.utils");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        const { payload, expired } = (0, auth_utils_1.verifyToken)(token, 'access');
        if (!payload) {
            if (expired)
                return res.status(401).send('token expired');
            return res.status(401).send('invalid token');
        }
        req.body.user = await prisma.user.findUnique({
            where: { id: payload === null || payload === void 0 ? void 0 : payload.id }
        });
        next();
    }
    catch (_a) {
        return res.status(500).send('server error');
    }
};
