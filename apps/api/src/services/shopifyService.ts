interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  variants: Array<{
    id: number;
    price: string;
    inventory_quantity: number;
  }>;
  images: Array<{
    src: string;
    alt?: string;
  }>;
}

interface ShopifyCheckout {
  id: string;
  web_url: string;
  completed_at: string | null;
  total_price: string;
  currency: string;
}

interface CheckoutItem {
  variantId: string;
  quantity: number;
}

class ShopifyService {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2023-10`;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(): Promise<ShopifyProduct[]> {
    const response = await this.makeRequest('/products.json');
    return response.products;
  }

  async getProduct(productId: string): Promise<ShopifyProduct> {
    const response = await this.makeRequest(`/products/${productId}.json`);
    return response.product;
  }

  async createCheckout(items: CheckoutItem[]): Promise<ShopifyCheckout> {
    const lineItems = items.map(item => ({
      variant_id: parseInt(item.variantId),
      quantity: item.quantity
    }));

    const checkoutData = {
      checkout: {
        line_items: lineItems
      }
    };

    const response = await this.makeRequest('/checkouts.json', {
      method: 'POST',
      body: JSON.stringify(checkoutData)
    });

    return response.checkout;
  }

  async getCheckout(checkoutId: string): Promise<ShopifyCheckout> {
    const response = await this.makeRequest(`/checkouts/${checkoutId}.json`);
    return response.checkout;
  }

  async updateCheckout(checkoutId: string, updates: Partial<ShopifyCheckout>): Promise<ShopifyCheckout> {
    const response = await this.makeRequest(`/checkouts/${checkoutId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ checkout: updates })
    });
    return response.checkout;
  }

  async getOrder(orderId: string) {
    const response = await this.makeRequest(`/orders/${orderId}.json`);
    return response.order;
  }

  async getOrders(limit: number = 50) {
    const response = await this.makeRequest(`/orders.json?limit=${limit}`);
    return response.orders;
  }

  async createWebhook(topic: string, address: string) {
    const webhookData = {
      webhook: {
        topic,
        address,
        format: 'json'
      }
    };

    const response = await this.makeRequest('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify(webhookData)
    });

    return response.webhook;
  }

  async getWebhooks() {
    const response = await this.makeRequest('/webhooks.json');
    return response.webhooks;
  }
}

export const shopifyService = new ShopifyService();