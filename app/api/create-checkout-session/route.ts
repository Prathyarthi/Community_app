import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { currentUser, getAuth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
    apiVersion: "2024-06-20",
});

const YOUR_DOMAIN = 'http://localhost:3000';

export async function POST(req: NextRequest) {
    try {

        const { userId } = getAuth(req);

        if (!userId) return null

        const profile = await db.profile.findFirst({
            where: { userId },
        });

        if (!profile) {
            return NextResponse.json("Profile not found", { status: 400 })
        }

        if (profile.subscription) {
            return NextResponse.redirect(`${YOUR_DOMAIN}`, 303)
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: 'CampusConnect',
                        },
                        unit_amount: 1200,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/?success=true`,
            cancel_url: `${YOUR_DOMAIN}/?canceled=true`,
        });

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

        return NextResponse.redirect(session.url || '', 303);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
