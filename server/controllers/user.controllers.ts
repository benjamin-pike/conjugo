import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { include } from "../utils/object.utils";

const prisma = new PrismaClient();

// @desc   Get user data
// @route  GET /api/user
// @access Private
export const getUser = async (req: Request, res: Response) => {
    const user = req.body.user

    return res.json(include(user, [
			"id",
			"username",
			"fname",
			"lname",
			"image",
			"email",
			"createdAt",
			"updatedAt"
		]));
}
