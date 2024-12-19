export const initialState = {
    prices: [],
    products: {}
}

export const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case "add_product": { // id
            return {
                ...state
            }
        }
    }
}
