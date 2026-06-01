"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CartItemInput = function () {
    var _a;
    var _variantId_decorators;
    var _variantId_initializers = [];
    var _variantId_extraInitializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _quantity_extraInitializers = [];
    var _warehouseId_decorators;
    var _warehouseId_initializers = [];
    var _warehouseId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CartItemInput() {
                this.variantId = __runInitializers(this, _variantId_initializers, void 0);
                this.quantity = (__runInitializers(this, _variantId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.warehouseId = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _warehouseId_initializers, void 0));
                __runInitializers(this, _warehouseId_extraInitializers);
            }
            return CartItemInput;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _variantId_decorators = [(0, class_validator_1.IsInt)()];
            _quantity_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.IsPositive)()];
            _warehouseId_decorators = [(0, class_validator_1.IsInt)()];
            __esDecorate(null, null, _variantId_decorators, { kind: "field", name: "variantId", static: false, private: false, access: { has: function (obj) { return "variantId" in obj; }, get: function (obj) { return obj.variantId; }, set: function (obj, value) { obj.variantId = value; } }, metadata: _metadata }, _variantId_initializers, _variantId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: function (obj) { return "warehouseId" in obj; }, get: function (obj) { return obj.warehouseId; }, set: function (obj, value) { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var CheckoutDto = function () {
    var _a;
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _voucherCode_decorators;
    var _voucherCode_initializers = [];
    var _voucherCode_extraInitializers = [];
    var _shippingAddress_decorators;
    var _shippingAddress_initializers = [];
    var _shippingAddress_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckoutDto() {
                this.items = __runInitializers(this, _items_initializers, void 0);
                this.voucherCode = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _voucherCode_initializers, void 0));
                this.shippingAddress = (__runInitializers(this, _voucherCode_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
                __runInitializers(this, _shippingAddress_extraInitializers);
            }
            return CheckoutDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _items_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return CartItemInput; })];
            _voucherCode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _shippingAddress_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _voucherCode_decorators, { kind: "field", name: "voucherCode", static: false, private: false, access: { has: function (obj) { return "voucherCode" in obj; }, get: function (obj) { return obj.voucherCode; }, set: function (obj, value) { obj.voucherCode = value; } }, metadata: _metadata }, _voucherCode_initializers, _voucherCode_extraInitializers);
            __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: function (obj) { return "shippingAddress" in obj; }, get: function (obj) { return obj.shippingAddress; }, set: function (obj, value) { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckoutDto = CheckoutDto;
