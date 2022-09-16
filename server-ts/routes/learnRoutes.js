"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/lesson', async (req, res) => {
    res.send('lesson');
});
router.post('/results', async (req, res) => {
    res.send('lesson');
});
module.exports = router;
