"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
exports.usersRouter = usersRouter;
usersRouter.post('/login', (req, res) => {
    res.send('login');
});
usersRouter.post('/register', (req, res) => {
    res.send('register');
});
//# sourceMappingURL=users.js.map