import crypto from 'crypto';

export function verifyHMAC(payload, hmac) {
  const expected = crypto.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  return expected === hmac;
}
