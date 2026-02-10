import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Role = 'ADMIN' | 'EMPLOYEE' | 'HR' | "MANAGER" | string;

interface AuthState{
    email : string | null,
    role : Role | null
}


const initialState: AuthState = {
  email: null,
  role : null
};


const AuthSlice = createSlice({
    name : "auth",
    initialState,
    reducers: {
        loginSuccess(state,action : PayloadAction<{email : string,role : string}>){
            state.email = action.payload.email;
            state.role = action.payload.role;
        },
        logout(state){
            state.email = null,
            state.role = null
        }
    }
})

export const {loginSuccess,logout} = AuthSlice.actions

export default AuthSlice.reducer;


export const selectEmail = (s: { auth: AuthState }) => s.auth.email ?? null;
export const selectRole = (s: { auth: AuthState }) => s.auth.role ?? null;
