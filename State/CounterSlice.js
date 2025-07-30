import {createSlice } from '@reduxjs/toolkit';

const counterslice =createSlice({
    name:'counter',
    initialState:{
        value:0
    },
    reducers:{
        increment:( state) => {
            state.value += 1;
        },
        decrement:(state) => {
            state.value -= 1;
        },
        reset:(state) => {
            state.value = 0;
        },
        incrementByAmount:(state, action) => {
            state.value += action.payload;
        },

    }
})

export const {increment, decrement, reset, incrementByAmount} = counterslice.actions;

export default counterslice.reducer;
