"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../../common/guards/roles.guard");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var role_enum_1 = require("../../common/enums/role.enum");
var OrdersController = function () {
    var _classDecorators = [(0, common_1.Controller)('orders'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _checkout_decorators;
    var _getMyOrders_decorators;
    var _getOrder_decorators;
    var _simulatePayment_decorators;
    var _cancelOrder_decorators;
    var _findAll_decorators;
    var OrdersController = _classThis = /** @class */ (function () {
        function OrdersController_1(ordersService) {
            this.ordersService = (__runInitializers(this, _instanceExtraInitializers), ordersService);
        }
        OrdersController_1.prototype.checkout = function (userId, dto) {
            return this.ordersService.checkout(userId, dto);
        };
        OrdersController_1.prototype.getMyOrders = function (userId) {
            return this.ordersService.findAll(userId);
        };
        OrdersController_1.prototype.getOrder = function (userId, id) {
            return this.ordersService.findOne(id, userId);
        };
        OrdersController_1.prototype.simulatePayment = function (id) {
            return this.ordersService.simulatePayment(id);
        };
        OrdersController_1.prototype.cancelOrder = function (id) {
            return this.ordersService.cancelOrder(id);
        };
        OrdersController_1.prototype.findAll = function () {
            return this.ordersService.findAll();
        };
        return OrdersController_1;
    }());
    __setFunctionName(_classThis, "OrdersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _checkout_decorators = [(0, common_1.Post)('checkout')];
        _getMyOrders_decorators = [(0, common_1.Get)('my-orders')];
        _getOrder_decorators = [(0, common_1.Get)(':id')];
        _simulatePayment_decorators = [(0, common_1.Patch)(':id/simulate-payment')];
        _cancelOrder_decorators = [(0, common_1.Patch)(':id/cancel'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.SUPER_ADMIN)];
        _findAll_decorators = [(0, common_1.Get)(), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN)];
        __esDecorate(_classThis, null, _checkout_decorators, { kind: "method", name: "checkout", static: false, private: false, access: { has: function (obj) { return "checkout" in obj; }, get: function (obj) { return obj.checkout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyOrders_decorators, { kind: "method", name: "getMyOrders", static: false, private: false, access: { has: function (obj) { return "getMyOrders" in obj; }, get: function (obj) { return obj.getMyOrders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrder_decorators, { kind: "method", name: "getOrder", static: false, private: false, access: { has: function (obj) { return "getOrder" in obj; }, get: function (obj) { return obj.getOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _simulatePayment_decorators, { kind: "method", name: "simulatePayment", static: false, private: false, access: { has: function (obj) { return "simulatePayment" in obj; }, get: function (obj) { return obj.simulatePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelOrder_decorators, { kind: "method", name: "cancelOrder", static: false, private: false, access: { has: function (obj) { return "cancelOrder" in obj; }, get: function (obj) { return obj.cancelOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersController = _classThis;
}();
exports.OrdersController = OrdersController;
