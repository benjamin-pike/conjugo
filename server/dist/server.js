"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const learn_routes_1 = __importDefault(require("./routes/learn.routes"));
const practice_routes_1 = __importDefault(require("./routes/practice.routes"));
const reference_routes_1 = __importDefault(require("./routes/reference.routes"));
dotenv_1.default.config(); // Configure environment variables
const port = process.env.PORT || 7000; // Set port
const app = (0, express_1.default)(); // Create express app
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express_1.default.static('./src/static')); // Serve static files
app.use((0, cookie_parser_1.default)()); // Parse cookies
app.use((0, cors_1.default)()); // Enable CORS
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
app.use('/api', auth_middleware_1.default); // Check authentication for all routes under /api
app.get('/api', async (_req, res) => {
    res.send('Hello World!');
});
app.use('/auth', auth_routes_1.default); // Routes for authentication
app.use('/api/user', user_routes_1.default); // Routes for user data
app.use('/api/learn', learn_routes_1.default); // Routes for 'learn' section
app.use('/api/practice', practice_routes_1.default); // Routes for 'practice' section
app.use('/api/reference', reference_routes_1.default); // Routes for 'reference' section
// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/build')));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../../', 'client', 'build', 'index.html'));
    });
}
else {
    app.get('*', (_req, res) => res.send('App is in development mode.'));
}
