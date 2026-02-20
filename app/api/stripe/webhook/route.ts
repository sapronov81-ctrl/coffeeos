import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const event = body.type;

    switch (event) {
        case 'payment_intent.succeeded':
            // Handle successful payment here
            console.log('PaymentIntent was successful!');
            break;
        case 'customer.subscription.updated':
            // Handle subscription update here
            console.log('Customer subscription updated!');
            break;
        case 'customer.subscription.deleted':
            // Handle subscription deletion here
            console.log('Customer subscription deleted!');
            break;
        default:
            console.log(`Unhandled event type ${event}`);
            return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
}