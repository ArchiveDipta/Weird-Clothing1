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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImagesService = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs-extra");
var path_1 = require("path");
var ProductImagesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductImagesService = _classThis = /** @class */ (function () {
        function ProductImagesService_1(prisma) {
            this.prisma = prisma;
        }
        ProductImagesService_1.prototype.uploadImages = function (productId, files, altTexts) {
            return __awaiter(this, void 0, void 0, function () {
                var product, images, i, file, imageUrl, altText, image, _a, _b, _c;
                var _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findUnique({
                                where: { id: productId },
                            })];
                        case 1:
                            product = _f.sent();
                            if (!product)
                                throw new common_1.NotFoundException('Product not found');
                            images = [];
                            i = 0;
                            _f.label = 2;
                        case 2:
                            if (!(i < files.length)) return [3 /*break*/, 7];
                            file = files[i];
                            imageUrl = "/uploads/products/".concat(file.filename);
                            altText = (altTexts === null || altTexts === void 0 ? void 0 : altTexts[i]) || product.name;
                            _b = (_a = this.prisma.productImage).create;
                            _d = {};
                            _e = {
                                productId: productId,
                                imageUrl: imageUrl,
                                altText: altText
                            };
                            _c = i === 0;
                            if (!_c) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.hasPrimaryImage(productId)];
                        case 3:
                            _c = !(_f.sent());
                            _f.label = 4;
                        case 4: return [4 /*yield*/, _b.apply(_a, [(_d.data = (_e.isPrimary = _c,
                                    _e),
                                    _d)])];
                        case 5:
                            image = _f.sent();
                            images.push(image);
                            _f.label = 6;
                        case 6:
                            i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, images];
                    }
                });
            });
        };
        ProductImagesService_1.prototype.getProductImages = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.productImage.findMany({
                            where: { productId: productId },
                            orderBy: { isPrimary: 'desc' },
                        })];
                });
            });
        };
        ProductImagesService_1.prototype.setPrimaryImage = function (productId, imageId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Unset primary yang lama
                        return [4 /*yield*/, this.prisma.productImage.updateMany({
                                where: { productId: productId, isPrimary: true },
                                data: { isPrimary: false },
                            })];
                        case 1:
                            // Unset primary yang lama
                            _a.sent();
                            // Set primary yang baru
                            return [2 /*return*/, this.prisma.productImage.update({
                                    where: { id: imageId },
                                    data: { isPrimary: true },
                                })];
                    }
                });
            });
        };
        ProductImagesService_1.prototype.deleteImage = function (imageId) {
            return __awaiter(this, void 0, void 0, function () {
                var image;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.productImage.findUnique({
                                where: { id: imageId },
                            })];
                        case 1:
                            image = _a.sent();
                            if (!image)
                                throw new common_1.NotFoundException('Image not found');
                            // Hapus file
                            return [4 /*yield*/, this.deleteImageFile(image.imageUrl)];
                        case 2:
                            // Hapus file
                            _a.sent();
                            return [2 /*return*/, this.prisma.productImage.delete({
                                    where: { id: imageId },
                                })];
                    }
                });
            });
        };
        ProductImagesService_1.prototype.hasPrimaryImage = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.productImage.count({
                                where: { productId: productId, isPrimary: true },
                            })];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count > 0];
                    }
                });
            });
        };
        ProductImagesService_1.prototype.deleteImageFile = function (imageUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var fileName, filePath, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            fileName = imageUrl.replace('/uploads/products/', '');
                            filePath = (0, path_1.join)(process.cwd(), 'uploads', 'products', fileName);
                            return [4 /*yield*/, fs.remove(filePath)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Failed to delete image:', error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductImagesService_1;
    }());
    __setFunctionName(_classThis, "ProductImagesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductImagesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductImagesService = _classThis;
}();
exports.ProductImagesService = ProductImagesService;
