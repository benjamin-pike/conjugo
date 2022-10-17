import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { exclude, include } from "../utils/object.utils";

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

// @desc   Get user language data
// @route  GET /api/user/languages
// @access Private
export const getLanguages = async (req: Request, res: Response) => {
    const user = req.body.user

    const data = await prisma.user.findUnique({
        where: { id: user.id },
        include: { XP: true }
    }).then(data => data?.XP) as { [key: string]: number } | null

    if (!data) return res.sendStatus(500)

    const xp = Object.keys(exclude(data, ['id', 'userId'])).reduce(
        (output: {[key: string]: {xp: Number}}, language) => {
            output[language] = {xp: data[language]}
            return output
        }, {})

    return res.json({ languages: xp })
}