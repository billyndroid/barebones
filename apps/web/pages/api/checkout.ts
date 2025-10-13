import { NextApiRequest, NextApiResponse } from 'next';

interface CheckoutItem {
  variantId: string;
  quantity: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items } = req.body as { items: CheckoutItem[] };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items are required' });
  }

  try {
    // Call your API to create checkout
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout' });
  }
}