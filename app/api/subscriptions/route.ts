import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', { apiVersion: '2020-08-27' });

export async function GET(req) {
    const userId = req.nextUrl.searchParams.get('userId');
    const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(subscriptions, { status: 200 });
}

export async function POST(req) {
    const { userId, priceId } = await req.json();
    const { data: subscription, error } = await stripe.subscriptions.create({
        customer: userId,
        items: [{ price: priceId }],
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await supabase.from('subscriptions').insert([{ user_id: userId, subscription_id: subscription.id }]);
    return NextResponse.json(subscription, { status: 201 });
}