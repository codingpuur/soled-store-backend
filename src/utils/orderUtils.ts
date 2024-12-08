import Coupon from '../models/Coupon';

export const calculateOrderAmount = async (items: any[], couponId?: string) => {
  let totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmount = 0;

  if (couponId) {
    const coupon = await Coupon.findById(couponId);
    if (coupon && coupon.isActive && coupon.validUntil > new Date() && totalAmount >= coupon.minimumPurchase) {
      discountAmount = (totalAmount * coupon.discount) / 100;
      totalAmount -= discountAmount;
    }
  }

  return { totalAmount, discountAmount };
};