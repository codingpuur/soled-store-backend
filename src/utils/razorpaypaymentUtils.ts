import * as crypto from 'crypto';

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string, 
  signature: string
): boolean => {
  const sign = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
    .update(sign.toString())
    .digest("hex");

  return expectedSignature === signature;
};