"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const base_controller_1 = require("../common/base.controller");
const http_error_class_1 = require("../errors/http-error.class");
class UsersController extends base_controller_1.BaseController {
    constructor(logger) {
        super(logger);
        this.bindRoutes([
            { path: '/login', method: 'post', func: this.login },
            { path: '/register', method: 'post', func: this.register },
        ]);
    }
    login(req, res, next) {
        next(new http_error_class_1.HTTPError(401, 'Error auth', 'login'));
    }
    register(req, res, next) {
        this.ok(res, 'register');
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map