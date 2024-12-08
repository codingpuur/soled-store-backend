import { Request, Response } from 'express';
import stripe from '../config/stripe';
import Order from '../models/Order';
import Stripe from 'stripe';


export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(failedPayment.id);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Webhook error' });
  }
};

const handleSuccessfulPayment = async (paymentIntentId: string) => {
  const order = await Order.findOne({ paymentIntentId });
  if (order) {
    order.paymentStatus = 'completed';
    await order.save();
  }
};

const handleFailedPayment = async (paymentIntentId: string) => {
  const order = await Order.findOne({ paymentIntentId });
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }
};