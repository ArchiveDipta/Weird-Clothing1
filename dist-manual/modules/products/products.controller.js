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
exports.ProductsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../../common/guards/roles.guard");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var role_enum_1 = require("../../common/enums/role.enum");
// Konfigurasi storage multer
var productImageStorage = (0, multer_1.diskStorage)({
    destination: './uploads/products',
    filename: function (req, file, callback) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        var ext = (0, path_1.extname)(file.originalname);
        callback(null, "product-".concat(uniqueSuffix).concat(ext));
    },
});
var imageFileFilter = function (req, file, callback) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
var ProductsController = function () {
    var _classDecorators = [(0, common_1.Controller)('products')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findOne_decorators;
    var _create_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _uploadImages_decorators;
    var _getProductImages_decorators;
    var _setPrimaryImage_decorators;
    var _deleteImage_decorators;
    var ProductsController = _classThis = /** @class */ (function () {
        function ProductsController_1(productsService, productImagesService) {
            this.productsService = (__runInitializers(this, _instanceExtraInitializers), productsService);
            this.productImagesService = productImagesService;
        }
        ProductsController_1.prototype.findAll = function () {
            return this.productsService.findAll();
        };
        ProductsController_1.prototype.findOne = function (id) {
            return this.productsService.findOne(id);
        };
        // ========== SINGLE IMAGE UPLOAD (THUMBNAIL) ==========
        ProductsController_1.prototype.create = function (dto, image) {
            var imageUrl = image ? "/uploads/products/".concat(image.filename) : null;
            return this.productsService.create(dto, imageUrl);
        };
        ProductsController_1.prototype.update = function (id, dto, image) {
            var imageUrl = image ? "/uploads/products/".concat(image.filename) : undefined;
            return this.productsService.update(id, dto, imageUrl);
        };
        ProductsController_1.prototype.remove = function (id) {
            return this.productsService.remove(id);
        };
        // ========== MULTIPLE IMAGES UPLOAD (GALLERY) ==========
        ProductsController_1.prototype.uploadImages = function (productId, images, altTexts) {
            return this.productImagesService.uploadImages(productId, images, altTexts);
        };
        ProductsController_1.prototype.getProductImages = function (productId) {
            return this.productImagesService.getProductImages(productId);
        };
        ProductsController_1.prototype.setPrimaryImage = function (productId, imageId) {
            return this.productImagesService.setPrimaryImage(productId, imageId);
        };
        ProductsController_1.prototype.deleteImage = function (imageId) {
            return this.productImagesService.deleteImage(imageId);
        };
        return ProductsController_1;
    }());
    __setFunctionName(_classThis, "ProductsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _create_decorators = [(0, common_1.Post)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
                storage: productImageStorage,
                fileFilter: imageFileFilter,
                limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            }))];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
                storage: productImageStorage,
                fileFilter: imageFileFilter,
                limits: { fileSize: 5 * 1024 * 1024 },
            }))];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN)];
        _uploadImages_decorators = [(0, common_1.Post)(':id/images'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN), (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
                storage: productImageStorage,
                fileFilter: imageFileFilter,
                limits: { fileSize: 5 * 1024 * 1024 },
            }))];
        _getProductImages_decorators = [(0, common_1.Get)(':id/images')];
        _setPrimaryImage_decorators = [(0, common_1.Patch)(':id/images/:imageId/primary'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN)];
        _deleteImage_decorators = [(0, common_1.Delete)('images/:imageId'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN)];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadImages_decorators, { kind: "method", name: "uploadImages", static: false, private: false, access: { has: function (obj) { return "uploadImages" in obj; }, get: function (obj) { return obj.uploadImages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductImages_decorators, { kind: "method", name: "getProductImages", static: false, private: false, access: { has: function (obj) { return "getProductImages" in obj; }, get: function (obj) { return obj.getProductImages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setPrimaryImage_decorators, { kind: "method", name: "setPrimaryImage", static: false, private: false, access: { has: function (obj) { return "setPrimaryImage" in obj; }, get: function (obj) { return obj.setPrimaryImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteImage_decorators, { kind: "method", name: "deleteImage", static: false, private: false, access: { has: function (obj) { return "deleteImage" in obj; }, get: function (obj) { return obj.deleteImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductsController = _classThis;
}();
exports.ProductsController = ProductsController;
