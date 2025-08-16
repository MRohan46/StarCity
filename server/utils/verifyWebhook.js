import crypto from 'crypto';

export function verifyHMAC(payload, hmac) {
  const expected = crypto.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
    .update(JSON.stringify(payload))
    .digest();

  const received = Buffer.from(hmac, 'hex');

  // Prevent mismatch length bug
  if (received.length !== expected.length) return false;

  return crypto.timingSafeEqual(expected, received);
}