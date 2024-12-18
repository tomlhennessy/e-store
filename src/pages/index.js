import Stripe from 'stripe';
import Head from 'next/head';

export async function getServerSideProps(context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET ?? '', {
    apiVersion: '2020-08-27'
  });

  try {
    const res = await stripe.prices.list({
      limit: 10,
      expand: ['data.product']
    });

    console.log('Stripe response:', res);

    const prices = res.data.filter(price => price.active);
    console.log('Filtered prices:', prices);

    return {
      props: { prices }
    };
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    return {
      props: { prices: [] } // Fallback to an empty array if there's an error
    };
  }
}

export default function Home({ prices }) {
  if (!Array.isArray(prices)) {
    console.error('Prices is not an array or is undefined:', prices);
    return <div>Something went wrong. No prices available.</div>;
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="content"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {prices.map(price => {
        const productName = price.product?.name || 'Unnamed Product';
        return <div key={price.id}>{productName}</div>;
      })}
    </div>
  );
}

