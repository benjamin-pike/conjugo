"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/configure', async (req, res) => {
    res.send('Configure');
});
router.put('/configure', async (req, res) => {
    res.send('Configure');
});
router.get('/conjugations', async (req, res) => {
    res.send('Conjugations');
});
router.post('/results', async (req, res) => {
    res.send('Results');
});
module.exports = router;
