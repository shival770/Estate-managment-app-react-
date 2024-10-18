import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser : null,
    loading : false ,
    error : null,   
}



const userSlice = createSlice({
    name : 'user',
    initialState ,
    reducers : {
        signInStart : (state) => {
            state.loading = true;

        },
        signInSuccess : (state , action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;

        },
        signInFailure : (state , action) => {
            state.error = action.payload;
            state.loading = false

        },
        updateStart : (state) => {
            state.loading = true;
        },
        updateSuccess : (state , action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure : (state , action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutStart : (state) => {
            state.loading = true ;
        },
        signOutSuccess : (state , action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutFailure : (state , action) => {
            state.error = action.payload ;
            state.loading = false;
        },
        deleteStart : (state) => {
            state.loading = true;
        },
        deleteSuccess : (state , action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteFailure : (state , action) => {
            state.error = action.payload;
            state.loading = false;

        }
        
    }
})


export const { signInStart , signInSuccess , signInFailure , updateFailure , updateStart , updateSuccess , signOutFailure , signOutStart , signOutSuccess 
, deleteFailure , deleteStart , deleteSuccess} = userSlice.actions;
export default userSlice.reducer;