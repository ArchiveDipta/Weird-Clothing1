# 🛍️ Weird Clothing — Fashion E-Commerce API

> RESTful API Backend untuk website e-commerce fashion berbasis **NestJS**, **Prisma ORM**, **MySQL**, dan **JWT Authentication**. Mendukung Multi-Warehouse, Voucher System, Simulasi Pembayaran, dan Dashboard Analytics.

---

## 📋 Daftar Isi

- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Struktur Folder](#-arsitektur--struktur-folder)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Authentication & RBAC](#-authentication--rbac)
- [API Documentation](#-api-documentation)
  - [Auth](#-auth)
  - [Users](#-users)
  - [Products](#-products)
  - [Warehouses](#-warehouses)
  - [Vouchers](#-vouchers)
  - [Cart](#-cart)
  - [Orders](#-orders)
  - [Analytics](#-analytics)
- [Order Status Flow](#-order-status-flow)
- [Transaction Safety & Race Condition Prevention](#-transaction-safety--race-condition-prevention)
- [Upload Gambar Produk](#-upload-gambar-produk)
- [Keamanan](#-keamanan)
- [Scripts](#-scripts)
- [Testing dengan Postman](#-testing-dengan-postman)
- [Deploy ke Railway](#-deploy-ke-railway)
- [Troubleshooting](#-troubleshooting)
- [Author](#-author)

---

## 🧰 Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **NestJS** | v10.x | Framework Backend (Modular Architecture) |
| **TypeScript** | v5.x | Bahasa Pemrograman |
| **Prisma ORM** | v5.x | Database ORM & Migration |
| **MySQL** | v8.x | Relational Database |
| **Passport.js** | v0.7.x | Authentication Middleware |
| **JWT** | v10.x | Token-based Authentication |
| **class-validator** | v0.14.x | Input Validation & DTO |
| **bcrypt** | v5.x | Password Hashing |
| **Multer** | v1.4.x | File Upload (Gambar Produk) |
| **fs-extra** | v11.x | File System Utilities |

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **JWT Authentication** | Register, Login, Token-based Auth |
| 👥 **RBAC 3 Role** | Super Admin, Admin, Customer |
| 📦 **Product Management** | CRUD Produk + Varian SKU (Warna & Ukuran) |
| 🏭 **Multi-Warehouse** | Stok dicatat per lokasi gudang |
| 🎟️ **Voucher System** | Diskon persen & nominal dengan validasi |
| 🛒 **Cart & Checkout** | Keranjang belanja + kalkulasi voucher |
| 💳 **Simulasi Pembayaran** | Mock payment endpoint tanpa payment gateway |
| 🔄 **Auto Decrement Stock** | Stok otomatis berkurang saat pembayaran sukses |
| ↩️ **Auto Increment Stock** | Stok dikembalikan saat order dibatalkan |
| 🛡️ **Transaction Safety** | `prisma.$transaction` Serializable untuk cegah Race Condition |
| 📊 **Dashboard Analytics** | Revenue, order, produk terlaris (Super Admin only) |
| 🖼️ **Upload Gambar** | Single & multiple image upload produk (Multer) |

---

## 🏗️ Arsitektur & Struktur Folder

```
fashion-ecommerce-api/
├── prisma/
│   ├── schema.prisma              # Skema database & relasi
│   ├── seed.js                    # Data awal (Super Admin, Admin, Warehouse, Product)
│   └── migrations/                # Prisma migration files
│
├── src/
│   ├── main.ts                    # Entry point, global pipes & filters
│   ├── app.module.ts              # Root module
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts       # Export PrismaService ke seluruh modul
│   │   └── prisma.service.ts      # PrismaClient singleton (connect/disconnect)
│   │
│   ├── common/                    # Shared resources antar modul
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts         # @Roles() decorator
│   │   │   └── current-user.decorator.ts  # @CurrentUser() decorator
│   │   ├── enums/
│   │   │   ├── role.enum.ts               # SUPER_ADMIN | ADMIN | CUSTOMER
│   │   │   └── order-status.enum.ts       # PENDING_PAYMENT | PAID | CANCELLED | ...
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts          # Guard autentikasi JWT
│   │   │   └── roles.guard.ts             # Guard otorisasi berbasis role
│   │   └── filters/
│   │       └── prisma-exception.filter.ts # Handler error Prisma (P2002, P2025, dll)
│   │
│   └── modules/
│       ├── auth/                  # Login, Register, JWT Strategy
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.module.ts
│       │
│       ├── users/                 # Profile & User Management
│       ├── products/              # CRUD Produk + Varian SKU + Upload Gambar
│       ├── warehouses/            # Multi-Warehouse + Stock Management
│       ├── vouchers/              # Kode Diskon
│       ├── cart/                  # Keranjang Belanja
│       ├── orders/                # Checkout, Simulasi Bayar, Cancel + Transaction Safety
│       └── analytics/             # Dashboard (Super Admin Only)
│
├── uploads/
│   └── products/                  # Folder gambar produk yang di-upload
│
├── .env                           # Environment variables (jangan di-push!)
├── .gitignore
├── railway.json                   # Konfigurasi deploy Railway
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

### Relasi Antar Tabel

```
User ──────────────── Order ──────────────── OrderItem
 │                      │                       │    │
 │                   Voucher              ProductVariant  Warehouse
 │                                              │
 └── CartItem ──── ProductVariant ──── WarehouseStock ──── Warehouse
                         │
                      Product ──── Category
                         │
                   ProductImage (Gallery)
```

### Tabel Utama

| Model | Deskripsi |
|-------|-----------|
| `User` | Data pengguna (id, email, password hash, fullName, role) |
| `Product` | Produk dengan basePrice, categoryId, imageUrl |
| `ProductVariant` | Varian SKU unik per kombinasi warna & ukuran |
| `ProductImage` | Gallery foto produk (multiple images) |
| `Warehouse` | Data gudang/cabang toko |
| `WarehouseStock` | Stok per variant per gudang (`@@unique([warehouseId, variantId])`) |
| `Voucher` | Kode diskon (PERCENTAGE / FIXED_AMOUNT) |
| `CartItem` | Item keranjang belanja |
| `Order` | Header pesanan dengan status & amount |
| `OrderItem` | Detail item per order + warehouseId asal stok |

### Enum

```prisma
enum Role         { SUPER_ADMIN | ADMIN | CUSTOMER }
enum OrderStatus  { PENDING_PAYMENT | PAID | PROCESSING | SHIPPED | DELIVERED | CANCELLED }
enum VoucherType  { PERCENTAGE | FIXED_AMOUNT }
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) **v18.x** atau lebih tinggi
- [MySQL](https://www.mysql.com/) v8.x (lokal via XAMPP/Laragon, atau cloud)
- [npm](https://www.npmjs.com/) (sudah include dengan Node.js)
- [Git](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/ArchiveDipta/Weird-Clothing1.git
cd Weird-Clothing1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
# Database MySQL
DATABASE_URL="mysql://root:@localhost:3306/fashion_db"

# JWT
JWT_SECRET="fashion_ecommerce_secret_key_2026_jangan_dibagikan"
JWT_EXPIRATION="7d"

# App
NODE_ENV="development"
PORT=3000
```

> **Catatan XAMPP/Laragon:** Password default biasanya kosong → `mysql://root:@localhost:3306/fashion_db`

### 4. Buat Database MySQL

Jalankan di MySQL/phpMyAdmin:

```sql
CREATE DATABASE IF NOT EXISTS fashion_db;
```

### 5. Jalankan Prisma Migration

```bash
# Generate Prisma Client
npx prisma generate

# Buat semua tabel di database
npx prisma migrate dev --name init
```

### 6. Seed Data Awal

```bash
npm run db:seed
```

Data yang ter-seed:

| Data | Detail |
|------|--------|
| Super Admin | `super@admin.com` / `superadmin123` |
| Admin | `admin@store.com` / `admin123` |
| Warehouse | Main Warehouse — Jakarta |
| Category | T-Shirt |
| Product | Basic Cotton T-Shirt (3 varian SKU) |
| Stock | 100 pcs per varian di Main Warehouse |

### 7. Jalankan Server

```bash
# Development (auto-reload)
npm run start:dev

# Production
npm run build && npm run start:prod
```

✅ Server berjalan di: `http://localhost:3000/api`

---

## 🔑 Environment Variables

| Variable | Wajib | Default | Keterangan |
|----------|-------|---------|------------|
| `DATABASE_URL` | ✅ | - | MySQL connection string |
| `JWT_SECRET` | ✅ | - | Secret key untuk signing JWT |
| `JWT_EXPIRATION` | ❌ | `7d` | Durasi token berlaku |
| `NODE_ENV` | ❌ | `development` | Environment mode |
| `PORT` | ❌ | `3000` | Port server |

---

## 🔐 Authentication & RBAC

### Hierarki Role

```
SUPER_ADMIN  ──────────────────────────────────────────────
     │        Akses semua endpoint + Dashboard Analytics
     │        Bypass semua role check secara otomatis
     │
   ADMIN  ──────────────────────────────────────────────────
     │        Product CRUD, Warehouse, Voucher, Cancel Order
     │        Get All Orders & Users
     │
 CUSTOMER  ──────────────────────────────────────────────────
             Register, Login, Lihat Produk, Cart, Checkout, Bayar
```

### Cara Mendapatkan Token

**1. Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "super@admin.com",
  "password": "superadmin123"
}
```

**2. Response:**
```json
{
  "user": {
    "id": 1,
    "email": "super@admin.com",
    "fullName": "Super Administrator",
    "role": "SUPER_ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**3. Gunakan token di setiap request:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📖 API Documentation

Base URL: `http://localhost:3000/api`

> **Legend:**
> - 🌐 Public (tanpa token)
> - 🔒 Perlu Login (customer/admin/super admin)
> - 👮 Admin / Super Admin only
> - 👑 Super Admin only

---

### 🔷 Auth

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/auth/register` | 🌐 | Registrasi customer baru |
| `POST` | `/auth/login` | 🌐 | Login semua role, dapat JWT token |

#### Register Customer

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "customer@gmail.com",
  "password": "password123",
  "fullName": "Budi Santoso"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 3,
    "email": "customer@gmail.com",
    "fullName": "Budi Santoso",
    "role": "CUSTOMER",
    "createdAt": "2026-05-27T10:00:00.000Z"
  },
  "token": "eyJhbGci..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@store.com",
  "password": "admin123"
}
```

---

### 🔷 Users

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/users/profile` | 🔒 | Lihat profil sendiri |
| `GET` | `/users` | 👮 | Lihat semua user |
| `GET` | `/users/:id` | 👮 | Lihat user by ID |

#### Get My Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 3,
  "email": "customer@gmail.com",
  "fullName": "Budi Santoso",
  "role": "CUSTOMER",
  "createdAt": "2026-05-27T10:00:00.000Z"
}
```

---

### 🔷 Products

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/products` | 🌐 | Lihat semua produk aktif + varian |
| `GET` | `/products/:id` | 🌐 | Detail produk + stok per warehouse |
| `POST` | `/products` | 👮 | Buat produk baru dengan varian SKU |
| `PATCH` | `/products/:id` | 👮 | Update produk |
| `DELETE` | `/products/:id` | 👮 | Hapus produk (cascade ke varian) |
| `POST` | `/products/:id/images` | 👮 | Upload multiple foto produk |
| `GET` | `/products/:id/images` | 🌐 | Lihat gallery foto produk |
| `PATCH` | `/products/:id/images/:imageId/primary` | 👮 | Set foto utama |
| `DELETE` | `/products/images/:imageId` | 👮 | Hapus foto produk |

#### Create Product

```http
POST /api/products
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

name          : Slim Fit Jeans
description   : Jeans slim fit premium denim
basePrice     : 399000
categoryId    : 1
isActive      : true
variants[0][sku]   : JE-BLU-30-001
variants[0][color] : Blue
variants[0][size]  : 30
variants[1][sku]   : JE-BLU-32-001
variants[1][color] : Blue
variants[1][size]  : 32
image         : [file jpg/png, max 5MB]
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Slim Fit Jeans",
  "description": "Jeans slim fit premium denim",
  "basePrice": "399000.00",
  "categoryId": 1,
  "imageUrl": "/uploads/products/product-1716800000.jpg",
  "isActive": true,
  "variants": [
    { "id": 4, "sku": "JE-BLU-30-001", "color": "Blue", "size": "30" },
    { "id": 5, "sku": "JE-BLU-32-001", "color": "Blue", "size": "32" }
  ],
  "category": { "id": 1, "name": "T-Shirt" }
}
```

#### Get All Products

```http
GET /api/products
```

#### Get Product Detail (dengan stok per warehouse)

```http
GET /api/products/1
```

#### Update Product

```http
PATCH /api/products/1
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

name      : Basic Cotton T-Shirt - Updated
basePrice : 219000
image     : [file baru, opsional — gambar lama dihapus otomatis]
```

#### Delete Product

```http
DELETE /api/products/1
Authorization: Bearer <token_admin>
```

#### Upload Multiple Foto (Gallery)

```http
POST /api/products/1/images
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

images    : [foto1.jpg]
images    : [foto2.jpg]
images    : [foto3.jpg]
altTexts  : Front view
altTexts  : Side view
altTexts  : Back view
```

---

### 🔷 Warehouses

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/warehouses` | 👮 | Lihat semua warehouse + stok |
| `GET` | `/warehouses/:id` | 👮 | Detail warehouse by ID |
| `POST` | `/warehouses` | 👮 | Buat warehouse baru |
| `POST` | `/warehouses/stock` | 👮 | Tambah / update stok varian di warehouse |

#### Create Warehouse

```http
POST /api/warehouses
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "name": "Warehouse Surabaya",
  "location": "Surabaya, Jawa Timur",
  "adminId": 2
}
```

#### Tambah Stock ke Warehouse

```http
POST /api/warehouses/stock
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "warehouseId": 1,
  "variantId": 1,
  "quantity": 50
}
```

> Kalau stok sudah ada, quantity akan di-**increment** (ditambah). Kalau belum ada, akan dibuat baru.

**Response:**
```json
{
  "id": 1,
  "warehouseId": 1,
  "variantId": 1,
  "quantity": 150
}
```

---

### 🔷 Vouchers

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/vouchers` | 👮 | Buat voucher diskon baru |
| `GET` | `/vouchers` | 👮 | Lihat semua voucher |
| `GET` | `/vouchers/:id` | 👮 | Detail voucher by ID |
| `PATCH` | `/vouchers/:id/toggle` | 👮 | Aktifkan / nonaktifkan voucher |

#### Create Voucher — Diskon Persen

```http
POST /api/vouchers
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "code": "SUMMER10",
  "type": "PERCENTAGE",
  "value": 10,
  "minPurchase": 100000,
  "maxDiscount": 50000,
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-12-31T23:59:59.000Z",
  "usageLimit": 100
}
```

#### Create Voucher — Potongan Nominal

```http
POST /api/vouchers
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "code": "HEMAT50K",
  "type": "FIXED_AMOUNT",
  "value": 50000,
  "minPurchase": 200000,
  "validFrom": "2026-01-01T00:00:00.000Z",
  "validUntil": "2026-06-30T23:59:59.000Z"
}
```

#### Toggle Voucher

```http
PATCH /api/vouchers/1/toggle
Authorization: Bearer <token_admin>
```

---

### 🔷 Cart

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/cart` | 🔒 | Lihat isi keranjang |
| `POST` | `/cart` | 🔒 | Tambah item ke keranjang |
| `DELETE` | `/cart/:id` | 🔒 | Hapus satu item dari keranjang |
| `DELETE` | `/cart` | 🔒 | Kosongkan semua keranjang |

#### Add to Cart

```http
POST /api/cart
Authorization: Bearer <token_customer>
Content-Type: application/json

{
  "variantId": 1,
  "quantity": 2
}
```

> Kalau item sudah ada di keranjang, quantity akan di-**increment** otomatis.

#### Lihat Keranjang

```http
GET /api/cart
Authorization: Bearer <token_customer>
```

**Response:**
```json
[
  {
    "id": 1,
    "quantity": 2,
    "variant": {
      "id": 1,
      "sku": "TS-BLK-M-001",
      "color": "Black",
      "size": "M",
      "product": {
        "name": "Basic Cotton T-Shirt",
        "basePrice": "199000.00"
      }
    }
  }
]
```

---

### 🔷 Orders

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/orders/checkout` | 🔒 | Checkout + validasi stok + hitung voucher |
| `GET` | `/orders/my-orders` | 🔒 | Lihat semua order milik customer |
| `GET` | `/orders/:id` | 🔒 | Detail order (customer hanya bisa lihat order sendiri) |
| `PATCH` | `/orders/:id/simulate-payment` | 🔒 | **Simulasi pembayaran sukses** → stok berkurang |
| `PATCH` | `/orders/:id/cancel` | 👮 | **Cancel order** → stok dikembalikan |
| `GET` | `/orders` | 👮 | Lihat semua order (admin) |

#### Checkout

```http
POST /api/orders/checkout
Authorization: Bearer <token_customer>
Content-Type: application/json

{
  "items": [
    {
      "variantId": 1,
      "quantity": 2,
      "warehouseId": 1
    },
    {
      "variantId": 2,
      "quantity": 1,
      "warehouseId": 1
    }
  ],
  "voucherCode": "SUMMER10",
  "shippingAddress": "Jl. Mawar No. 10, Jakarta Selatan 12345"
}
```

**Response (201):**
```json
{
  "id": 1,
  "status": "PENDING_PAYMENT",
  "totalAmount": "597000.00",
  "discountAmount": "50000.00",
  "finalAmount": "547000.00",
  "shippingAddress": "Jl. Mawar No. 10, Jakarta Selatan 12345",
  "items": [...]
}
```

#### Simulasi Pembayaran ⭐

```http
PATCH /api/orders/1/simulate-payment
Authorization: Bearer <token_customer>
```

**Efek yang terjadi (dalam 1 Prisma Transaction):**
1. Validasi status order harus `PENDING_PAYMENT`
2. Validasi ulang stok tersedia di warehouse
3. **Decrement stok** per item per warehouse
4. Status order berubah menjadi **`PAID`**

**Response:**
```json
{
  "success": true,
  "message": "Payment simulated successfully",
  "order": {
    "id": 1,
    "status": "PAID",
    "finalAmount": "547000.00",
    "updatedAt": "2026-05-27T11:00:00.000Z"
  }
}
```

#### Cancel Order ⭐

```http
PATCH /api/orders/1/cancel
Authorization: Bearer <token_admin>
```

**Efek yang terjadi (dalam 1 Prisma Transaction):**
- Jika status `PAID` → **Increment stok** dikembalikan ke warehouse asal
- Jika status `PENDING_PAYMENT` → Voucher `usageCount` dikurangi
- Status berubah menjadi **`CANCELLED`**

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled and stock restored",
  "order": {
    "id": 1,
    "status": "CANCELLED"
  }
}
```

---

### 🔷 Analytics

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/analytics/dashboard` | 👑 | Total revenue, orders, produk, customer |
| `GET` | `/analytics/top-products` | 👑 | Produk terlaris berdasarkan qty terjual |

#### Dashboard Summary

```http
GET /api/analytics/dashboard
Authorization: Bearer <token_super_admin>
```

**Response:**
```json
{
  "totalRevenue": "15750000.00",
  "totalPaidOrders": 42,
  "totalActiveProducts": 8,
  "totalCustomers": 156
}
```

#### Top Selling Products

```http
GET /api/analytics/top-products?limit=5
Authorization: Bearer <token_super_admin>
```

**Response:**
```json
[
  {
    "variantId": 1,
    "sku": "TS-BLK-M-001",
    "productName": "Basic Cotton T-Shirt",
    "totalSold": 87
  },
  {
    "variantId": 4,
    "sku": "JE-BLU-30-001",
    "productName": "Slim Fit Jeans",
    "totalSold": 54
  }
]
```

---

## 🔄 Order Status Flow

```
  Customer Checkout
        │
        ▼
 PENDING_PAYMENT ──────────── Admin Cancel ──────► CANCELLED
        │                                              ▲
        │                                              │
  simulate-payment                            Admin Cancel (stok balik)
        │                                              │
        ▼                                              │
      PAID ──────────────────────────────────────────►┘
        │
        ▼
   PROCESSING  (Admin update manual)
        │
        ▼
    SHIPPED
        │
        ▼
   DELIVERED
```

---

## 🛡️ Transaction Safety & Race Condition Prevention

### Prisma Serializable Transaction

Fitur simulasi pembayaran dan cancel order menggunakan `prisma.$transaction` dengan isolation level **Serializable** untuk mencegah **race condition** (stok minus saat banyak user checkout bersamaan):

```typescript
return this.prisma.$transaction(async (tx) => {
  // 1. Cek stok tersedia
  const stock = await tx.warehouseStock.findUnique({ ... });
  if (!stock || stock.quantity < item.quantity) {
    throw new BadRequestException('Stok tidak mencukupi');
  }
  
  // 2. Kurangi stok (atomic)
  await tx.warehouseStock.update({
    data: { quantity: { decrement: item.quantity } }
  });
  
  // 3. Update status order
  await tx.order.update({ data: { status: 'PAID' } });
  
}, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
```

### Tabel Keamanan Sistem

| Aspek | Implementasi |
|-------|-------------|
| **Race Condition Stok** | `prisma.$transaction` dengan `Serializable` isolation |
| **Auto Decrement Stok** | Saat `simulate-payment` sukses |
| **Auto Increment Stok** | Saat `cancel` order berstatus `PAID` |
| **Voucher Safety** | `usageCount` update dalam transaction yang sama dengan order |
| **RBAC** | `@Roles()` decorator + `RolesGuard`; Super Admin bypass semua |
| **Input Validation** | `class-validator` + `ValidationPipe` global (`whitelist: true`) |
| **Password Hashing** | `bcrypt` dengan salt round 10 |
| **JWT Expiry** | Token expire sesuai `JWT_EXPIRATION` (default 7 hari) |
| **Prisma Error Handling** | `PrismaExceptionFilter` global untuk error P2002, P2025, dll |

---

## 🖼️ Upload Gambar Produk

### Spesifikasi Upload

| Aspek | Detail |
|-------|--------|
| **Format** | JPG, JPEG, PNG, GIF, WebP |
| **Ukuran Max** | 5 MB per file |
| **Single Upload** | Thumbnail utama produk (field: `image`) |
| **Multiple Upload** | Gallery foto produk (field: `images`, max 10 file) |
| **Penyimpanan** | `./uploads/products/` |
| **Akses URL** | `http://localhost:3000/uploads/products/nama-file.jpg` |

### Contoh Upload di Postman

1. Method: `POST` → `/api/products`
2. Tab: **Body** → pilih **form-data**
3. Isi field teks dan tambah field `image` dengan type **File**

---

## 📜 Scripts

```bash
# Development
npm run start:dev      # Auto-reload dengan file watcher

# Production
npm run build          # Compile TypeScript ke dist/
npm run start:prod     # Jalankan dari dist/

# Database
npx prisma generate    # Generate Prisma Client
npx prisma migrate dev # Buat migration baru (development)
npx prisma migrate deploy  # Apply migration (production)
npm run db:seed        # Seed data awal
npx prisma studio      # GUI database browser
```

---

## 🧪 Testing dengan Postman

### Urutan Test Lengkap

```
1. Seed data              → npm run db:seed
2. Jalankan server        → npm run start:dev
3. Login Super Admin      → POST /api/auth/login
4. Buat Warehouse baru    → POST /api/warehouses
5. Buat Product + Varian  → POST /api/products
6. Tambah Stok            → POST /api/warehouses/stock
7. Buat Voucher           → POST /api/vouchers
8. Register Customer      → POST /api/auth/register
9. Login Customer         → POST /api/auth/login
10. Add to Cart           → POST /api/cart
11. Checkout              → POST /api/orders/checkout
12. Simulate Payment      → PATCH /api/orders/1/simulate-payment
13. Cek Stok Berkurang    → GET /api/warehouses/1
14. Cancel Order (Admin)  → PATCH /api/orders/1/cancel
15. Cek Stok Kembali      → GET /api/warehouses/1
16. Dashboard Analytics   → GET /api/analytics/dashboard
```

---

## 🚢 Deploy ke Railway

### 1. Prepare File

Buat `railway.json` di root project:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npx prisma generate && npm run start:prod",
    "healthcheckPath": "/api",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Environment Variables di Railway

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `mysql://user:pass@host:3306/railway` |
| `JWT_SECRET` | `fashion_ecommerce_secret_key_2026` |
| `JWT_EXPIRATION` | `7d` |
| `NODE_ENV` | `production` |

### 3. Deploy

```bash
git add .
git commit -m "chore: setup railway deployment"
git push origin main
```

Railway akan auto-deploy setiap push ke branch `main`.

---

## 🔧 Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `P1000: Authentication failed` | Password MySQL salah di `.env` | Cek `DATABASE_URL`, password XAMPP default kosong |
| `P2002: Unique constraint failed` | SKU/email/kode voucher sudah ada | Gunakan nilai unik |
| `P2025: Record not found` | ID tidak ditemukan di database | Cek ID yang digunakan |
| `Cannot find module 'fs-extra'` | Package belum terinstall | `npm install fs-extra multer` |
| `lock file out of sync` | `package-lock.json` tidak sinkron | Hapus `node_modules` + `package-lock.json`, lalu `npm install` |
| `JWT_SECRET not defined` | `.env` tidak ada / salah nama | Pastikan file `.env` ada di root project |
| `Insufficient stock` | Stok di warehouse kurang | Tambah stok via `POST /api/warehouses/stock` |
| `Voucher usage limit reached` | Voucher sudah habis | Tambah `usageLimit` atau buat voucher baru |

---

## 👨‍💻 Author

**Pradipta Daniswara Setiabudi**
XI RPL 3 / 31

> Proyek ini dibuat untuk memenuhi tugas sekolah mata pelajaran Pemrograman Web & Backend.

---

## 📄 License

MIT — bebas digunakan untuk keperluan edukasi.