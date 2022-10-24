"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const learn_controllers_1 = require("../controllers/learn.controllers");
const router = express_1.default.Router();
router.get('/progress/:language', learn_controllers_1.progress);
router.post('/lesson/:language', learn_controllers_1.lesson);
router.post('/results/:language', learn_controllers_1.results);
exports.default = router;
