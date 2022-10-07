"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reference_controllers_1 = require("../controllers/reference.controllers");
const router = express_1.default.Router();
router.get('/data/:language/:verb', reference_controllers_1.getConjugations);
router.get('/saved/:language', reference_controllers_1.getSavedVerbs);
router.put('/saved/:language/:verb', reference_controllers_1.updateSavedVerbs);
router.delete('/saved/:language/:verb', reference_controllers_1.updateSavedVerbs);
exports.default = router;
