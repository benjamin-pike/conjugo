"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static('./src/static'));
app.use((0, cors_1.default)());
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
app.get('/', async (req, res) => {
    res.send('Hello World!');
});
app.use('/learn', require('./routes/learnRoutes'));
app.use('/practice', require('./routes/practiceRoutes'));
app.use('/reference', require('./routes/referenceRoutes'));
