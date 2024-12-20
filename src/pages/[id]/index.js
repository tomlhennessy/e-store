import { useAppContext } from '@/context/CartContext';
import React from 'react';
import Image from 'next/image';

export async function getServerSideProps(context) {
    const { params } = context;

    return {
        props: { id: params.id },
    };
}

export default function Description(props) {
    const { id: path } = props;
    const { state: { prices } = [], dispatch } = useAppContext();
    const product = prices.filter(val => val.id === path.replace('/', ''))[0];

    // Debugging
    console.log('Prices:', prices);
    console.log('Path:', path.replace('/', ''));

    // Handle cases where product is not found or incomplete
    if (!product || !product.product || !product.product.images?.length) {
        return <div>Product not found or missing data</div>;
    }

    function addToBasket(prod) {
        return () => {
            dispatch({
                type: 'add_product',
                value: prod.id,
            });
        };
    }

    return (
      <div className='mx-auto max-w-4xl flex flex-col md:flex-row gap-6 p-4 items-center'>
          {/* Image Section */}
          <div className='flex-shrink-0'>
              <Image
                  src={product.product.images[0]}
                  alt={product.product.id}
                  layout="intrinsic"
                  width={400}
                  height={600}
                  className='rounded-lg shadow-md'
              />
          </div>

          {/* Description Section */}
          <div className='flex flex-col justify-center max-w-md mx-auto'>
              <div className='flex justify-between items-center'>
                <h1 className='text-lg font-medium lg:text-2xl mb-4'>
                    {product.product.name}
                </h1>
                <p className='text-gray-800 text-medium lg:text-base mb-4'>${product.unit_amount/100}</p>
              </div>

              <p className='text-gray-600 text-sm lg:text-base mb-6'>
                  {product.product.description || "No description available."}
              </p>

              <hr className='my-4 border-t-2 border-gray-200' />

              <button
                  onClick={addToBasket(product)}
                  className='bg-stone-800 text-white py-2 px-4 rounded hover:bg-green-500 transition'
              >
                  ADD TO BASKET
              </button>
          </div>
      </div>
  );

}
