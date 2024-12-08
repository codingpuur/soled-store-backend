import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import stripe from '../config/stripe';
import { calculateOrderAmount } from '../utils/orderUtils';
import { verifyToken } from '../utils/verifyToken';

export const createOrder = async (req: any, res: Response) => {
  try {
    const { items, shippingAddress, couponId } = req.body;
    
    // Validate product availability and calculate total
    const orderItems = await Promise.all(items.map(async (item: any) => {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Product ${item.product} is out of stock`);
      }
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price
      };
    }));

    const { totalAmount, discountAmount } = await calculateOrderAmount(orderItems, couponId);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' }
    });

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentIntentId: paymentIntent.id,
      couponApplied: couponId,
      discountAmount
    });

    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    order.paymentStatus = 'completed';
    await order.save();

    res.json({ message: 'Order confirmed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = await verifyToken(req);
    const orders = await Order.find({ user: userId })
      // .populate('items.product')
      // .populate('couponApplied');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};