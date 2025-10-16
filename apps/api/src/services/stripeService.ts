import Stripe from 'stripe';

class StripeService {
  private stripe: Stripe | null = null;
  private isEnabled: boolean = false;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey && secretKey !== 'sk_test_replace_with_your_stripe_secret_key') {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-09-30.clover',
      });
      this.isEnabled = true;
    } else {
      console.warn('⚠️  Stripe not configured - using demo mode. Set STRIPE_SECRET_KEY to enable real payments.');
      this.isEnabled = false;
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>) {
    if (!this.isEnabled || !this.stripe) {
      // Return a mock PaymentIntent for demo mode
      return {
        id: `pi_demo_${Date.now()}`,
        client_secret: `pi_demo_${Date.now()}_secret_demo`,
        amount: Math.round(amount * 100),
        currency,
        status: 'requires_payment_method',
        metadata: metadata || {}
      } as any;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe PaymentIntent creation failed:', error);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    if (!this.isEnabled || !this.stripe) {
      // Return a mock confirmed PaymentIntent for demo mode
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 0,
        currency: 'usd'
      } as any;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe PaymentIntent confirmation failed:', error);
      throw error;
    }
  }

  async createCustomer(email: string, name?: string) {
    if (!this.isEnabled || !this.stripe) {
      // Return a mock customer for demo mode
      return {
        id: `cus_demo_${Date.now()}`,
        email,
        name: name || null
      } as any;
    }

    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      console.error('Stripe Customer creation failed:', error);
      throw error;
    }
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    if (!this.isEnabled || !this.stripe) {
      // Return a mock succeeded PaymentIntent for demo mode
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 0,
        currency: 'usd'
      } as any;
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe PaymentIntent retrieval failed:', error);
      throw error;
    }
  }

  async handleWebhook(rawBody: string, signature: string) {
    if (!this.isEnabled || !this.stripe) {
      // Return a mock event for demo mode
      return {
        id: `evt_demo_${Date.now()}`,
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_demo_123',
            metadata: {}
          }
        }
      } as any;
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      return event;
    } catch (error) {
      console.error('Stripe webhook signature verification failed:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    if (!this.isEnabled || !this.stripe) {
      // Return a mock refund for demo mode
      return {
        id: `re_demo_${Date.now()}`,
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : 0,
        status: 'succeeded'
      } as any;
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if specified
      });
      return refund;
    } catch (error) {
      console.error('Stripe refund failed:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();