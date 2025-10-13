import crypto from 'crypto';

export function verifyShopifyWebhook(body: string, signature: string): boolean {
  if (!signature) {
    return false;
  }

  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('SHOPIFY_WEBHOOK_SECRET is not configured');
    return false;
  }

  // Remove 'sha256=' prefix if present
  const cleanSignature = signature.replace('sha256=', '');
  
  // Create HMAC using the webhook secret
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(body, 'utf8');
  const computedSignature = hmac.digest('base64');

  // Compare signatures using crypto.timingSafeEqual to prevent timing attacks
  const providedSignature = Buffer.from(cleanSignature, 'base64');
  const computedSignatureBuffer = Buffer.from(computedSignature, 'base64');

  if (providedSignature.length !== computedSignatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedSignature, computedSignatureBuffer);
}