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
exports.CartController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var CartController = function () {
    var _classDecorators = [(0, common_1.Controller)('cart'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCart_decorators;
    var _addToCart_decorators;
    var _removeFromCart_decorators;
    var _clearCart_decorators;
    var CartController = _classThis = /** @class */ (function () {
        function CartController_1(cartService) {
            this.cartService = (__runInitializers(this, _instanceExtraInitializers), cartService);
        }
        CartController_1.prototype.getCart = function (userId) {
            return this.cartService.getCart(userId);
        };
        CartController_1.prototype.addToCart = function (userId, dto) {
            return this.cartService.addToCart(userId, dto);
        };
        CartController_1.prototype.removeFromCart = function (userId, id) {
            return this.cartService.removeFromCart(userId, id);
        };
        CartController_1.prototype.clearCart = function (userId) {
            return this.cartService.clearCart(userId);
        };
        return CartController_1;
    }());
    __setFunctionName(_classThis, "CartController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCart_decorators = [(0, common_1.Get)()];
        _addToCart_decorators = [(0, common_1.Post)()];
        _removeFromCart_decorators = [(0, common_1.Delete)(':id')];
        _clearCart_decorators = [(0, common_1.Delete)()];
        __esDecorate(_classThis, null, _getCart_decorators, { kind: "method", name: "getCart", static: false, private: false, access: { has: function (obj) { return "getCart" in obj; }, get: function (obj) { return obj.getCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addToCart_decorators, { kind: "method", name: "addToCart", static: false, private: false, access: { has: function (obj) { return "addToCart" in obj; }, get: function (obj) { return obj.addToCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeFromCart_decorators, { kind: "method", name: "removeFromCart", static: false, private: false, access: { has: function (obj) { return "removeFromCart" in obj; }, get: function (obj) { return obj.removeFromCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clearCart_decorators, { kind: "method", name: "clearCart", static: false, private: false, access: { has: function (obj) { return "clearCart" in obj; }, get: function (obj) { return obj.clearCart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartController = _classThis;
}();
exports.CartController = CartController;
