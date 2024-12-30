export const initialState = {
    prices: [],
    products: {},
    displayCheckout: false,
    notification: ''
};

export const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case "add_product": { // Add or increment product
            const productId = action.value;
            return {
                ...state,
                products: {
                    ...state.products,
                    [productId]: (state.products[productId] || 0) + 1 // Increment or initialize quantity
                },
                notification: 'Item added to cart!' // Set notification
            };
        }

        case "remove_product": { // Remove product completely
            const productId = action.value;
            const { [productId]: removed, ...remainingProducts } = state.products;
            return {
                ...state,
                products: remainingProducts
            };
        }

        case "vary_count": { // Update quantity directly
            const [productId, count] = action.value;
            if (count <= 0) {
                const { [productId]: removed, ...remainingProducts } = state.products;
                return {
                    ...state,
                    products: remainingProducts
                };
            }
            return {
                ...state,
                products: {
                    ...state.products,
                    [productId]: count
                }
            };
        }

        case "load_items": { // Load items into state
            return {
                ...state,
                prices: action.value.prices,
                products: action.value.products
            };
        }

        case "set_prices": { // Set prices
            return {
                ...state,
                prices: action.value
            };
        }

        case "set_display_checkout": { // Show or hide the cart
            return {
                ...state,
                displayCheckout: action.value
            };
        }

        case "remove_notification": { // Clear notification
            return {
                ...state,
                notification: ''
            };
        }

        default:
            return state;
    }
};
