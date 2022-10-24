import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { include } from "../utils/object.utils";
import languages from "../assets/languages.assets";

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
        include: { UserProgress: true }
    }).then(data => data?.UserProgress)

    if (!data) return res.sendStatus(500)

    const dataObject = Object.fromEntries(data.map(entry => [entry.language, entry.totalXP]))

    const xp = languages.reduce((
        output: { [key: string]: {xp: number} }, 
        language
    ) => {
        output[language] = { xp: dataObject[language] ?? 0 }
        return output
    }, {})

    return res.json({ languages: xp })
}