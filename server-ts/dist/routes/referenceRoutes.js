"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const referenceControllers_1 = require("../controllers/referenceControllers");
const router = express_1.default.Router();
router.get('/conjugations/:language/:verb', referenceControllers_1.getConjugations);
router.get('/starred/:language', referenceControllers_1.getStarred);
router.put('/starred/:language/:verb', referenceControllers_1.updateStarred);
router.delete('/starred/:language/:verb', referenceControllers_1.updateStarred);
module.exports = router;
