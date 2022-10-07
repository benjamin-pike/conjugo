"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const practice_controllers_1 = require("../controllers/practice.controllers");
const router = express_1.default.Router();
router.get('/configure/:language', practice_controllers_1.getPracticeConfig);
router.put('/configure/:language', practice_controllers_1.updatePracticeConfig);
router.get('/session/:language', practice_controllers_1.generatePracticeSession);
router.post('/results/:language', practice_controllers_1.calculatePracticeResults);
// module.exports = router;
exports.default = router;
