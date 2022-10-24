"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const ranks = [...Array(2083).keys()].map(i => i + 1);
    for (let rank of ranks) {
        const verb = await prisma.verb.findUnique({
            where: {
                language_rank: {
                    language: 'german',
                    rank
                }
            }
        });
        if (!verb)
            return;
        const conjugations = verb.conjugations;
        if (!conjugations)
            return;
        conjugations['compound']['subjunctive']['imperfectCorrected'] = conjugations['compound']['subjunctive']['future'];
        conjugations['compound']['subjunctive']['futureCorrected'] = conjugations['compound']['subjunctive']['imperfect'];
        conjugations['compound']['subjunctive']['imperfect'] = conjugations['compound']['subjunctive']['imperfectCorrected'];
        conjugations['compound']['subjunctive']['future'] = conjugations['compound']['subjunctive']['futureCorrected'];
        delete conjugations['compound']['subjunctive']['imperfectCorrected'];
        delete conjugations['compound']['subjunctive']['futureCorrected'];
        const updatedVerb = await prisma.verb.update({
            where: {
                language_rank: {
                    language: 'german',
                    rank
                }
            },
            data: {
                conjugations
            }
        });
        console.log(rank, updatedVerb.infinitive);
    }
}
exports.default = main;
