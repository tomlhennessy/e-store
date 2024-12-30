import React, { useState, useRef } from 'react';
import Router from 'next/router';
import { useAppContext } from '../context/CartContext';
import styles from './header.module.css';

export default function Header() {
    const [displayCheckout, setDisplayCheckout] = useState(false);
    const modalRef = useRef();
    const { state, dispatch } = useAppContext();
    console.log(state);

    async function checkout() {
        const lineItems = Object.keys(state.products).map(productId => ({
            price: productId, // Stripe price ID
            quantity: state.products[productId] // Quantity
        }));

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
        if (!data.session?.url) {
            console.error('Invalid response from API:', data);
            alert('Unexpected error. Please try again.');
            return;
        }

        Router.push(data.session.url);
    }

    function increment(id, count) {
        return () => dispatch({
            type: 'vary_count',
            value: [id, (count || 0) + 1]
        });
    }

    function decrement(id, count) {
        if ((count || 0) - 1 > 0) {
            return () => dispatch({
                type: 'vary_count',
                value: [id, (count || 0) - 1]
            });
        }
        return () => dispatch({
            type: 'remove_product',
            value: id
        });
    }

    return (
        <nav className="flex items-center white shadow-lg sticky top-0 relative z-50 bg-white">
            {displayCheckout && (
                <div
                    ref={modalRef}
                    className="absolute bg-white shadow border border-gray-200 border-solid z-50 top-0 h-screen w-screen sm:w-80 right-0 flex flex-col gap-2 px-2"
                >
                    <div className="overflow-auto flex-1">
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl py-4">CART</h1>
                            <div
                                className="ml-auto w-fit p-2 cursor-pointer select-none transition duration-300 opacity-50"
                                onClick={() => setDisplayCheckout(false)}
                            >
                                ╳
                            </div>
                        </div>
                        <hr className="py-2" />
                        {Object.keys(state.products).map((productId, index) => {
                            const product = state.prices.find(val => val.id === productId);
                            const quantity = state.products[productId];

                            return (
                                <div key={index} className="border-l border-solid border-gray-100 text-xs p-2 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate">{product.product.name}</p>
                                        <p>${product.unit_amount / 100}</p>
                                    </div>
                                    <div className="font-extralight flex justify-between items-center">
                                        <h1>QUANTITY: {quantity}</h1>
                                        <div>
                                            <span className="pl-4 border border-solid py-1 pr-6 border-gray-400 ml-3 relative">
                                                <div className="absolute top-0 right-0 h-full w-3 flex flex-col">
                                                    <div
                                                        className="leading-none scale-75 cursor-pointer"
                                                        onClick={increment(productId, quantity)}
                                                    >
                                                        <i className="fa-solid fa-chevron-up"></i>
                                                    </div>
                                                    <div
                                                        className="leading-none scale-75 cursor-pointer"
                                                        onClick={decrement(productId, quantity)}
                                                    >
                                                        <i className="fa-solid fa-chevron-down"></i>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={checkout}
                        className="m-1 shadow bg-black text-white font-light text-sm py-2 transition duration-300 hover:opacity-50 select-none"
                    >
                        CHECKOUT
                    </button>
                </div>
            )}
            <h1
                onClick={() => Router.push('/')}
                className="font-sans text-gray-800 text-3xl font-medium text-center tracking-wide px-4 py-6 sm:py-14 pl-14 cursor-pointer select-none flex-1 transition hover:opacity-80"
            >
                Tom&apos;s Apparel
            </h1>
            <div
                className="relative cursor-pointer grid place-items-center"
                onClick={() => setDisplayCheckout(!displayCheckout)}
            >
                <i className="fa-solid fa-bag-shopping px-2 py-2 text-xl sm:text-3xl mr-4 transition hover:opacity-60 duration-300"></i>
                {Object.keys(state.products).length > 0 && (
                    <div className="absolute inset-0 mx-auto top-1.5 h-2 w-2 rounded-full bg-rose-400 z-20" />
                )}
            </div>
        </nav>
    );
}
