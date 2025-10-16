# Barebones E-Commerce Platform

A modern, full-stack e-commerce application built with cutting-edge technologies for scalability and performance.

## 🚀 Tech Stack

### Backend
- **Framework**: Fastify (high-performance Node.js web framework)
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript
- **Authentication**: JWT-based auth system
- **Integration**: Shopify webhooks and API

### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Modern CSS with responsive design
- **State Management**: React Context API
- **HTTP Client**: Axios

## 📁 Project Structure

```
barebones/
├── apps/
│   ├── api/                    # Backend API Server
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   ├── src/
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── auth.ts     # Authentication routes
│   │   │   │   ├── products.ts # Product management
│   │   │   │   ├── orders.ts   # Order processing
│   │   │   │   └── checkout.ts # Checkout flow
│   │   │   ├── services/       # Business logic
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── prisma/         # Database client
│   │   │   ├── seed.ts         # Database seeding
│   │   │   └── index.ts        # Server entry point
│   │   └── package.json
│   └── web/                    # Frontend Next.js App
│       ├── components/         # React components
│       │   ├── AuthModal.tsx   # User authentication
│       │   ├── CartSidebar.tsx # Shopping cart
│       │   ├── ProductGrid.tsx # Product display
│       │   └── Header.tsx      # Navigation
│       ├── contexts/           # React contexts
│       │   ├── AuthContext.tsx # Authentication state
│       │   ├── CartContext.tsx # Cart management
│       │   └── ToastContext.tsx# Notifications
│       ├── pages/              # Next.js pages
│       │   ├── index.tsx       # Home page
│       │   ├── products.tsx    # Product catalog
│       │   ├── orders.tsx      # Order history
│       │   └── profile.tsx     # User profile
│       └── package.json
├── package.json                # Root package.json (workspace)
└── README.md
```

## 🛠 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/billyndroid/barebones.git
   cd barebones
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   ```
   Configure your database connection and other settings in `.env`

4. **Initialize the database**
   ```bash
   # Generate Prisma client
   npm run db:generate --workspace=apps/api
   
   # Push schema to database
   npm run db:push --workspace=apps/api
   
   # Seed with sample data (optional)
   npm run db:seed --workspace=apps/api
   ```

5. **Start development servers**
   ```bash
   # Start both API and web servers
   npm run dev
   
   # Or start individually:
   npm run dev:api    # API server only
   npm run dev:web    # Web app only
   ```

## 🌐 Development Servers

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 📡 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order

### Checkout & Payments
- `POST /api/checkout/create-payment-intent` - Create Stripe PaymentIntent
- `POST /api/checkout/confirm-payment/:orderId` - Confirm payment completion
- `POST /api/checkout/complete/:orderId` - Complete order (legacy/demo)
- `POST /api/checkout/webhook/stripe` - Handle Stripe webhooks
- `GET /api/checkout/order-status/:orderId` - Get order payment status

## 🎯 Features

### Implemented
- ✅ Product catalog with search and filtering
- ✅ User authentication (register/login)
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Responsive design
- ✅ TypeScript throughout
- ✅ Database with Prisma ORM
- ✅ Error handling and validation
- ✅ CORS configuration
- ✅ Health monitoring

### Recently Added
- ✅ Payment integration foundation (Stripe-ready architecture)
- ✅ Enhanced checkout flow with payment tracking
- ✅ Order payment status management

### Planned
- 🔄 Full Stripe Elements integration (see STRIPE_SETUP.md)
- 🔄 Admin dashboard
- 🔄 Product reviews and ratings
- 🔄 Email notifications
- 🔄 Inventory management
- 🔄 Shopify integration completion

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:
- **Users**: Customer accounts and authentication
- **Products**: Product catalog with pricing and descriptions
- **Orders**: Purchase orders and transaction history
- **OrderItems**: Individual items within orders

## 🔧 Available Scripts

```bash
# Root level commands
npm run dev              # Start both API and web servers
npm run dev:api          # Start API server only
npm run dev:web          # Start web server only
npm run build            # Build both applications
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Port conflicts**: If ports 3000 or 3001 are in use:
```bash
# Kill existing processes
taskkill /F /IM node.exe
# Or change ports in the configuration
```

**Database connection**: Ensure PostgreSQL is running and connection string is correct in `.env`

**CORS errors**: The API is configured to allow requests from localhost:3000 and localhost:3002

### Support

For issues and questions, please open an issue on GitHub or contact the development team.