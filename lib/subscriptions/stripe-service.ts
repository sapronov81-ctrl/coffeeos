// stripe-service.ts

import Stripe from 'stripe';

const stripe = new Stripe('your-secret-key', {
    apiVersion: '2020-08-27',
});

export const createPaymentIntent = async (amount: number) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

export const confirmPayment = async (paymentIntentId: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Error confirming payment:', error);
        throw error;
    }
};
