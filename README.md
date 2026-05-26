# 🛍️ Fashion E-Commerce API

RESTful API Backend untuk website e-commerce fashion seperti Uniqlo menggunakan **NestJS**, **Prisma ORM**, **MySQL**, dan **JWT Authentication**. Dibuat untuk tugas sekolah, tetapi fiturnya sudah mulai menyerupai startup yang habis bakar dana investor. Manusia memang tidak bisa melihat kata “tugas” tanpa menambahkan analytics dashboard segala.

---

# 🚀 Features

- 🔐 JWT Authentication & Role-Based Access Control (RBAC)
- 👥 Multi Role: Super Admin, Admin, Customer
- 🛒 Cart & Checkout System
- 📦 Multi-Warehouse Stock Management
- 🎟️ Voucher / Discount System
- 💳 Simulasi Pembayaran
- 📊 Dashboard Analytics
- 🔄 Auto Stock Increment & Decrement
- ⚡ Prisma Transaction untuk mencegah race condition
- ✅ Input Validation dengan class-validator

---

# 🧰 Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| NestJS | v10.x | Framework Backend |
| TypeScript | v5.x | Bahasa Pemrograman |
| Prisma ORM | v5.x | Database ORM |
| MySQL | v8.x | Database |
| Passport.js | v0.7.x | Authentication Middleware |
| JWT | v10.x | Token-based Auth |
| class-validator | v0.14.x | Input Validation |
| bcrypt | v5.x | Password Hashing |

---

# 📋 Prerequisites

Pastikan sudah terinstall:

- Node.js v18.x atau lebih tinggi
- MySQL / XAMPP
- npm

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/USERNAME/fashion-ecommerce-api.git
cd fashion-ecommerce-api
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment Variables

Buat file `.env` di root project:

```env
# Database MySQL
DATABASE_URL="mysql://root:password@localhost:3306/fashion_db"

# JWT Secret
JWT_SECRET="fashion_ecommerce_secret_key_2026_jangan_dibagikan"
JWT_EXPIRATION="7d"
```

### Catatan

- Ganti `root` dan `password` sesuai MySQL Anda
- Jika menggunakan XAMPP default:

```env
DATABASE_URL="mysql://root:@localhost:3306/fashion_db"
```

---

## 4. Setup Database Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan Migration
npx prisma migrate dev --name init
```

---

## 5. Seed Database

```bash
npm run db:seed
```

### Data Awal

| Role | Email | Password |
|---|---|---|
| Super Admin | super@admin.com | superadmin123 |
| Admin | admin@store.com | admin123 |

### Seed Data

- Main Warehouse (Jakarta)
- Basic Cotton T-Shirt
- 3 Product Variants
- Stock 100 pcs per varian

---

## 6. Jalankan Server

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

Server berjalan di:

```bash
http://localhost:3000/api
```

---

# 🔐 Authentication & RBAC

## Role Access

| Role | Hak Akses |
|---|---|
| SUPER_ADMIN | Semua endpoint + Dashboard Analytics |
| ADMIN | Product CRUD, Warehouse, Voucher, Cancel Order |
| CUSTOMER | Register, Login, Product, Cart, Checkout, Payment |

---

# 🔑 Cara Mendapatkan Token

## Login Super Admin

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "super@admin.com",
  "password": "superadmin123"
}
```

### Response

```json
{
  "user": {
    "id": 1,
    "email": "super@admin.com",
    "fullName": "Super Administrator",
    "role": "SUPER_ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Gunakan token pada header:

```http
Authorization: Bearer <token>
```

---

# 📚 API Documentation

# 🔷 AUTH

## Register Customer

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "customer@gmail.com",
  "password": "password123",
  "fullName": "Budi Santoso"
}
```

---

## Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "customer@gmail.com",
  "password": "password123"
}
```

---

# 🔷 USERS

## Get My Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

---

## Get All Users

```http
GET /api/users
Authorization: Bearer <token_admin>
```

---

# 🔷 PRODUCTS

## Get All Products

```http
GET /api/products
```

---

## Get Product Detail

```http
GET /api/products/1
```

---

## Create Product

```http
POST /api/products
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "name": "Slim Fit Jeans",
  "description": "Jeans slim fit premium",
  "basePrice": 399000,
  "categoryId": 1,
  "isActive": true,
  "variants": [
    {
      "sku": "JE-BLU-30-001",
      "color": "Blue",
      "size": "30"
    },
    {
      "sku": "JE-BLU-32-001",
      "color": "Blue",
      "size": "32"
    }
  ]
}
```

---

## Update Product

```http
PATCH /api/products/2
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "name": "Slim Fit Jeans Updated",
  "basePrice": 429000
}
```

---

## Delete Product

```http
DELETE /api/products/2
Authorization: Bearer <token_admin>
```

---

# 🔷 WAREHOUSES

## Get All Warehouses

```http
GET /api/warehouses
Authorization: Bearer <token_admin>
```

---

## Create Warehouse

```http
POST /api/warehouses
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "name": "Warehouse Bandung",
  "location": "Bandung",
  "adminId": 2
}
```

---

## Update Stock

```http
POST /api/warehouses/stock
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "warehouseId": 1,
  "variantId": 1,
  "quantity": 50
}
```

---

# 🔷 VOUCHERS

## Create Voucher

```http
POST /api/vouchers
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
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

---

## Get All Vouchers

```http
GET /api/vouchers
Authorization: Bearer <token_admin>
```

---

## Toggle Voucher Active/Inactive

```http
PATCH /api/vouchers/1/toggle
Authorization: Bearer <token_admin>
```

---

# 🔷 CART

## Add To Cart

```http
POST /api/cart
Authorization: Bearer <token_customer>
Content-Type: application/json
```

```json
{
  "variantId": 1,
  "quantity": 2
}
```

---

## Get My Cart

```http
GET /api/cart
Authorization: Bearer <token_customer>
```

---

## Remove Item From Cart

```http
DELETE /api/cart/1
Authorization: Bearer <token_customer>
```

---

## Clear Cart

```http
DELETE /api/cart
Authorization: Bearer <token_customer>
```

---

# 🔷 ORDERS

## Checkout

```http
POST /api/orders/checkout
Authorization: Bearer <token_customer>
Content-Type: application/json
```

```json
{
  "items": [
    {
      "variantId": 1,
      "quantity": 2,
      "warehouseId": 1
    }
  ],
  "voucherCode": "SUMMER10",
  "shippingAddress": "Jl. Mawar No. 10, Jakarta Selatan"
}
```

### Status Awal

```txt
PENDING_PAYMENT
```

---

## Simulate Payment

```http
PATCH /api/orders/1/simulate-payment
Authorization: Bearer <token_customer>
```

### Efek

- Status berubah menjadi `PAID`
- Stock warehouse otomatis berkurang
- Menggunakan Prisma Transaction

---

## Get My Orders

```http
GET /api/orders/my-orders
Authorization: Bearer <token_customer>
```

---

## Get Order Detail

```http
GET /api/orders/1
Authorization: Bearer <token_customer>
```

---

## Cancel Order

```http
PATCH /api/orders/1/cancel
Authorization: Bearer <token_admin>
```

### Efek

- Jika status `PAID` → stock dikembalikan
- Jika status `PENDING_PAYMENT` → voucher usage dikembalikan

---

## Get All Orders

```http
GET /api/orders
Authorization: Bearer <token_admin>
```

---

# 🔷 ANALYTICS

## Dashboard Summary

```http
GET /api/analytics/dashboard
Authorization: Bearer <token_super_admin>
```

### Response

```json
{
  "totalRevenue": 1990000,
  "totalPaidOrders": 15,
  "totalActiveProducts": 5,
  "totalCustomers": 30
}
```

---

## Top Selling Products

```http
GET /api/analytics/top-products?limit=5
Authorization: Bearer <token_super_admin>
```

### Response

```json
[
  {
    "variantId": 1,
    "sku": "TS-BLK-M-001",
    "productName": "Basic Cotton T-Shirt",
    "totalSold": 25
  }
]
```

---

# 📁 Folder Structure

```plaintext
fashion-ecommerce-api/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── enums/
│   │   ├── guards/
│   │   └── filters/
│   └── modules/
│       ├── auth/
│       ├── users/
│       ├── products/
│       ├── warehouses/
│       ├── vouchers/
│       ├── cart/
│       ├── orders/
│       └── analytics/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🔒 Security & Transaction Safety

| Fitur | Implementasi |
|---|---|
| Race Condition Prevention | Prisma Transaction + Serializable Isolation |
| Auto Decrement Stock | Saat pembayaran sukses |
| Auto Increment Stock | Saat cancel order |
| Voucher Safety | Update usage count dalam transaction |
| RBAC | RolesGuard + @Roles() |
| Input Validation | ValidationPipe global |
| Password Hashing | bcrypt salt round 10 |
| JWT Authentication | Passport.js + JWT |

---

# 🧪 Testing API

Gunakan:

- Postman
- Thunder Client

### Urutan Testing yang Disarankan

1. Register/Login Customer
2. Lihat Produk
3. Add To Cart
4. Checkout
5. Simulate Payment
6. Login Admin
7. Cancel Order
8. Login Super Admin
9. Dashboard Analytics

Karena hidup manusia memang siklus tanpa akhir antara “endpoint sudah jalan” lalu lima menit kemudian “kok 500 internal server error”.

---

# 📝 Catatan Penting

## Simulasi Pembayaran

Endpoint berikut hanya simulasi:

```http
PATCH /orders/:id/simulate-payment
```

Tidak menggunakan payment gateway seperti Midtrans atau Xendit.

---

## Multi-Warehouse

Setiap `OrderItem` mencatat `warehouseId` sehingga stok berkurang dari warehouse tertentu.

---

## SKU Unik

Setiap kombinasi warna dan ukuran memiliki SKU unik menggunakan Prisma `@unique`.

---

# ✅ Kesimpulan

Project ini mendukung:

- Multi-role authentication
- Multi-warehouse stock management
- Voucher & discount system
- Simulasi pembayaran
- Dashboard analytics
- Transaction safety menggunakan Prisma
- Auto stock synchronization

Cukup overkill untuk tugas sekolah. Yang biasanya terjadi berikutnya adalah guru bilang, “bagus, tapi mana flowchart?” Sejarah pendidikan memang kejam.

---

# 👨‍💻 Author

**Pradipta Daniswara Setiabudi**

## Kelas

**XI RPL 3 / 31**