export const initialState = {
    prices: [],
    products: {} // {[id]: quantity}
}

export const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case "add_product": { // Add or increment product
            const productId = action.value;
            return {
                ...state,
                products: {
                    ...state.products,
                    [productId]: (state.products[productId] || 0) + 1 // Increment or initialize quantity
                }
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
        case "load_items": {
            return {
                ...state,
                prices: action.value.prices,
                products: action.value.products
            }
        }
        case "set_prices": {
            return {
                ...state,
                prices: action.value
            }
        }
    }
}
