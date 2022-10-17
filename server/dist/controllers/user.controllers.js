"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguages = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const object_utils_1 = require("../utils/object.utils");
const prisma = new client_1.PrismaClient();
// @desc   Get user data
// @route  GET /api/user
// @access Private
const getUser = async (req, res) => {
    const user = req.body.user;
    return res.json((0, object_utils_1.include)(user, [
        "id",
        "username",
        "fname",
        "lname",
        "image",
        "email",
        "createdAt",
        "updatedAt"
    ]));
};
exports.getUser = getUser;
// @desc   Get user language data
// @route  GET /api/user/languages
// @access Private
const getLanguages = async (req, res) => {
    const user = req.body.user;
    const data = await prisma.user.findUnique({
        where: { id: user.id },
        include: { XP: true }
    }).then(data => data === null || data === void 0 ? void 0 : data.XP);
    if (!data)
        return res.sendStatus(500);
    const xp = Object.keys((0, object_utils_1.exclude)(data, ['id', 'userId'])).reduce((output, language) => {
        output[language] = { xp: data[language] };
        return output;
    }, {});
    return res.json({ languages: xp });
};
exports.getLanguages = getLanguages;
