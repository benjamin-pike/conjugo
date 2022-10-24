"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguages = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const object_utils_1 = require("../utils/object.utils");
const languages_assets_1 = __importDefault(require("../assets/languages.assets"));
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
        include: { UserProgress: true }
    }).then(data => data === null || data === void 0 ? void 0 : data.UserProgress);
    if (!data)
        return res.sendStatus(500);
    const dataObject = Object.fromEntries(data.map(entry => [entry.language, entry.totalXP]));
    const xp = languages_assets_1.default.reduce((output, language) => {
        var _a;
        output[language] = { xp: (_a = dataObject[language]) !== null && _a !== void 0 ? _a : 0 };
        return output;
    }, {});
    return res.json({ languages: xp });
};
exports.getLanguages = getLanguages;
