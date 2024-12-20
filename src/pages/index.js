import Stripe from 'stripe';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PurchaseCard from '@/components/PurchaseCard';
import { useEffect } from 'react';
import { useAppContext } from '@/context/CartContext';

export async function getServerSideProps(context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET ?? '', {
    apiVersion: '2020-08-27'
  });

  try {
    const res = await stripe.prices.list({
      limit: 10,
      expand: ['data.product']
    });

    const prices = res.data.filter(price => price.active);

    return {
      props: { prices }
    };
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    return {
      props: { prices: [] }
    };
  }
}

export default function Home({ prices }) {
  const { state, dispatch } = useAppContext()
  const router = useRouter();

  if (!Array.isArray(prices)) {
    console.error('Prices is not an array or is undefined:', prices);
    return <div>Something went wrong. No prices available.</div>;
  }

  async function checkout(priceId) {
    try {
      const lineItems = [{
        price: priceId,
        quantity: 1
      }];

      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ lineItems }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        console.error('Failed to create checkout session:', await res.text());
        alert('Failed to create checkout session. Please try again.');
        return;
      }

      const data = await res.json();
      console.log('Checkout session data:', data);

      if (!data.session?.url) {
        console.error('Invalid session response:', data);
        alert('Unexpected error. Please try again.');
        return;
      }

      router.push(data.session.url);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Something went wrong. Please try again.');
    }
  }

  useEffect(() => {
    dispatch({
      type: 'set_prices',
      value: prices
    })
  }, [prices])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="content"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {prices.map(price => {
        const productName = price.product?.name || 'Unnamed Product';
        return (
          <PurchaseCard price={price} key={price.id} />
        );
      })}
    </div>
  );
}
