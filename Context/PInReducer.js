export const pinReducer = (state = [], action) => 
    {
        switch (action.type) {
            case 'LOAD_PINS':
                return action.payload || [];
            case 'ADD_PIN':
                return [...state, action.payload];
            case 'UPDATE_PIN':
                return state.map(pin =>
                    pin.id === action.payload.id ? { ...pin, ...action.payload } : pin
                );
            case 'REMOVE_PIN':
                return state.filter(pin => pin.id !== action.payload);
            default: 
                return state;
        }
    };
    
