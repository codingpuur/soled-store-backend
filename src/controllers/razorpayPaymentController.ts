import { Request, Response } from 'express';
import razorpay from '../config/razorpay';
import { verifyPaymentSignature } from '../utils/razorpaypaymentUtils';


import Order from '../models/Order';
import { verifyToken } from '../utils/verifyToken';

// Frontend Flow:
// 1. User adds items to cart and proceeds to checkout
// 2. Frontend collects shipping address and validates cart items
// 3. Frontend calls saveOrder API with cart items, address, userId and total amount
// 4. After order is saved, frontend calls createOrder API with final amount
// 5. Razorpay payment form opens with order details
// 6. User completes payment
// 7. Frontend verifies payment with verifyPayment API
// 8. On success, user is shown order confirmation

export const saveOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress,totalAmount } = req.body;
    const { userId } = await verifyToken(req);
   

    const order = await Order.create({
      user: userId,
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save order'
    });
  }
};


export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderdetail , amount, currency = 'INR' } = req.body;
    const { items, shippingAddress,totalAmount } = orderdetail;
    // console.log(items, shippingAddress,totalAmount , amount, currency);
    const { userId } = await verifyToken(req);
   

   

    

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Order.create({
      user: userId,
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      paymentIntentId: order.id,
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id,razorpay_signature } = req.body;
    const orderId = razorpay_order_id;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      res.status(400).json({ error: 'Invalid payment signature' });
      return;
    }

    // Find the order with razorpay_order_id in paymentIntentId field
    const order = await Order.findOne({ paymentIntentId: orderId });
    
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Update payment status
    order.paymentStatus = 'completed';
    await order.save();

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const createQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const qrCode = await razorpay.qrCode.create({
      type: "upi_qr",
      name: "TSS Store Payment",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: 1599.00,
      description: "Payment for order",
      close_by: Math.floor(Date.now() / 1000) + 3600,
      notes: {
        purpose: "Order payment",
      },
    });

    res.json(qrCode);
  } catch (error) {
    console.error('Error creating QR Code:', error);
    res.status(500).json({ error: 'Failed to create QR Code' });
  }
};

export const closeQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrCodeId } = req.body;
    
    const closedQR = await razorpay.qrCode.close(qrCodeId);
    res.json({ success: true, message: 'QR Code closed successfully', data: closedQR });
  } catch (error) {
    console.error('Error closing QR Code:', error);
    res.status(500).json({ error: 'Failed to close QR Code' });
  }
};
