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



  useEffect(() => {
    dispatch({
      type: 'set_prices',
      value: prices
    })
  }, [prices])
  console.log(prices)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Head>
        <title>Tom's Apparel</title>
        <meta name="description" content="content"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prices.map(price => (
          <PurchaseCard price={price} key={price.id} />
        ))}
      </div>
    </div>
  );
}
