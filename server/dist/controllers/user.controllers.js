"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
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
