// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Stripe from 'stripe';

export default async function handler(req, res) {
  // Check for POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST method required' });
  }

  try {
    // Parse request body
    const body = JSON.parse(req.body);

    // Validate lineItems
    if (!body.lineItems || body.lineItems.length === 0) {
      return res.status(400).json({ message: 'Please select items for purchase' });
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET ?? '', {
      apiVersion: '2020-08-27'
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: body.lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });

    // Respond with session URL
    res.status(200).json({ url: session.url });
  } catch (err) {
    // Log and return error response
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

