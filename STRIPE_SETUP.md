# Stripe Integration Setup

This project now includes Stripe payment processing integration. Here's how to set it up:

## 1. Get Stripe API Keys

1. Sign up for a [Stripe account](https://stripe.com) if you don't have one
2. Go to the [Stripe Dashboard](https://dashboard.stripe.com)
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** and **Secret key** (use test keys for development)

## 2. Configure Environment Variables

Update your `.env` file with your Stripe keys:

```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_your_actual_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"  # Optional for now

# Next.js
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_actual_publishable_key_here"
```

## 3. Database Migration

The database schema has been updated to include payment-related fields. Run:

```bash
npm run db:generate --workspace=apps/api
npm run db:push --workspace=apps/api
```

## 4. Testing the Integration

### Test Cards

Use these test card numbers in development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiration date, any 3-digit CVC, and any postal code.

### Demo Mode

The current implementation includes a "SimpleCheckout" component that simulates the payment flow without requiring Stripe keys. This allows you to test the complete checkout flow even without Stripe setup.

## 5. API Endpoints

New payment-related endpoints:

- `POST /api/checkout/create-payment-intent` - Creates a Stripe PaymentIntent
- `POST /api/checkout/confirm-payment/:orderId` - Confirms payment completion
- `POST /api/checkout/webhook/stripe` - Handles Stripe webhooks
- `GET /api/checkout/order-status/:orderId` - Gets order payment status

## 6. Next Steps

The foundation is now in place for:

1. **Real Stripe Integration**: Replace `SimpleCheckout` with full Stripe Elements
2. **Webhook Handling**: Set up webhook endpoints for payment confirmations
3. **Payment Status**: Track payment states throughout the order lifecycle
4. **Refunds**: Add refund capabilities through the admin dashboard

## 7. Components

- `SimpleCheckout`: Demo checkout component (current implementation)
- `StripeCheckout`: Full Stripe Elements integration (can be implemented next)
- Enhanced `CartSidebar`: Now supports the new checkout flow

## Security Notes

- Never commit real API keys to version control
- Use test keys during development
- Implement proper webhook signature verification in production
- Consider PCI compliance requirements for production use

## Troubleshooting

### Common Issues

1. **"Cannot find module 'stripe'"**: Run `npm install` in the API workspace
2. **Database errors**: Make sure to run Prisma migrations after schema changes
3. **CORS errors**: Verify API_URL environment variables are correct

### Development Tips

- Use Stripe's test mode exclusively during development
- Test with various card scenarios (success, decline, authentication required)
- Monitor Stripe Dashboard for transaction logs and debugging information