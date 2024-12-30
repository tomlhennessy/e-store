import React, { useEffect } from 'react';
import Router from 'next/router';
import { useAppContext } from '../context/CartContext';

export default function Header() {
    const { state, dispatch } = useAppContext();

    useEffect(() => {
        // Automatically clear the notification after 3 seconds
        if (state.notification) {
            const timer = setTimeout(() => {
                dispatch({ type: 'remove_notification' });
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [state.notification, dispatch]);

    async function checkout() {
        const lineItems = Object.keys(state.products).map(productId => ({
            price: productId,
            quantity: state.products[productId]
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

    return (
        <>
            {/* Fixed Header */}
            <nav className="flex items-center white shadow-lg sticky top-0 z-30 bg-white">
                {/* Notification */}
                {state.notification && (
                    <div
                        className="fixed top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50 transition-opacity duration-300"
                    >
                        {state.notification}
                    </div>
                )}

                {/* Logo / Brand Name */}
                <h1
                    onClick={() => Router.push('/')}
                    className="font-sans text-gray-800 text-3xl font-medium text-center tracking-wide px-4 py-6 sm:py-14 pl-14 cursor-pointer select-none flex-1 transition hover:opacity-80"
                >
                    Tom&apos;s Apparel
                </h1>

                {/* Cart Icon */}
                <div
                    className="relative cursor-pointer grid place-items-center"
                    onClick={() =>
                        dispatch({ type: 'set_display_checkout', value: !state.displayCheckout })
                    }
                >
                    <i className="fa-solid fa-bag-shopping px-2 py-2 text-xl sm:text-3xl mr-4 transition hover:opacity-60 duration-300"></i>
                    {Object.keys(state.products).length > 0 && (
                        <div className="absolute inset-0 mx-auto top-1.5 h-2 w-2 rounded-full bg-rose-400 z-20" />
                    )}
                </div>
            </nav>

            {/* Cart Modal */}
            {state.displayCheckout && (
                <div className="fixed bg-white shadow-lg border border-gray-200 z-40 top-0 h-screen w-screen sm:w-96 right-0 flex flex-col gap-4 px-4 py-6">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h1 className="text-2xl font-bold">Your Cart</h1>
                        <button
                            className="text-gray-500 hover:text-black"
                            onClick={() =>
                                dispatch({ type: 'set_display_checkout', value: false })
                            }
                        >
                            &times;
                        </button>
                    </div>
                    <div className="overflow-auto flex-1">
                        {Object.keys(state.products).length === 0 ? (
                            <div className="text-center text-gray-500 mt-6">Your cart is empty.</div>
                        ) : (
                            Object.keys(state.products).map((productId, index) => {
                                const product = state.prices.find(val => val.id === productId);
                                const quantity = state.products[productId];

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border-b py-4"
                                    >
                                        <div className="flex flex-col">
                                            <p className="font-medium truncate">
                                                {product.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${product.unit_amount / 100}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                className="px-2 text-lg text-gray-600 hover:text-black"
                                                onClick={() =>
                                                    dispatch({
                                                        type: 'vary_count',
                                                        value: [productId, quantity - 1]
                                                    })
                                                }
                                            >
                                                &minus;
                                            </button>
                                            <span className="px-4">{quantity}</span>
                                            <button
                                                className="px-2 text-lg text-gray-600 hover:text-black"
                                                onClick={() =>
                                                    dispatch({
                                                        type: 'vary_count',
                                                        value: [productId, quantity + 1]
                                                    })
                                                }
                                            >
                                                &#43;
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {Object.keys(state.products).length > 0 && (
                        <button
                            onClick={checkout}
                            className="w-full bg-black text-white py-3 rounded-md hover:opacity-80"
                        >
                            Proceed to Checkout
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
