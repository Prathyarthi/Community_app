import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;
    console.log(process.env.STRIPE_WEBHOOK_SECRET);

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;

    if (event.type === 'checkout.session.completed') {
        if (!userId) {
            return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }

        try {
            await db.profile.update({
                where: { userId },
                data: { subscription: true }
            })

            console.log(`Subscription updated for userId: ${userId}`);
        } catch (error) {
            console.error(`Database Error:${error}`);
            return new NextResponse(`Database Error: ${error}`, { status: 500 });
        }

    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}