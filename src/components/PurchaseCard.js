import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function PurchaseCard(props) {
  const { price } = props;
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${price.id}`)}
      className="w-full h-96 shadow-md border border-gray-100 cursor-pointer transition hover:opacity-75 bg-white rounded-lg overflow-hidden"
    >
      {price.product.images && price.product.images.length > 0 && (
        <div className="h-3/4 relative">
          <Image
            src={price.product.images[0]}
            alt={price.product.name || 'Product Image'}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-sm font-semibold truncate">{price.product.name}</h1>
        <p className="text-gray-600 text-sm">${price.unit_amount / 100}</p>
      </div>
    </div>
  );
}
