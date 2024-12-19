import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function PurchaseCard(props) {
  const { price } = props;
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/${price.id}`)} className='w-60 h-80 shadow-md border border-solid border-gray-100 cursor-pointer transition hover:opacity-60 bg-white'>
      {price.product.images && price.product.images.length > 0 && (
        <div className='h-60 relative'>
          <Image
            src={price.product.images[0]} // Stripe product image URL
            alt={price.product.name || 'Product Image'} // Fallback for accessibility
            layout='fill'
            objectFit='cover'
            className='rounded-t-md'
          />
        </div>
      )}
      <div className='flex px-4 justify-between items-center'>
        <h1 className='text-small text-center py-2 font-light tracking-wide uppercase'>
          {price.product.name}
        </h1>
        <p className='text-center text-sm font-extralight'>${price.unit_amount/100}</p>
      </div>
    </div>
  );
}
