import { createSlice, configureStore, PayloadAction  } from '@reduxjs/toolkit'
import Cookies from "js-cookie";

type actionType = {
    email: string
    phrase: string
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: {
            email: '',
            phrase: ''
        }
    },
    reducers: {
        login: (state, action:PayloadAction<actionType>) => {
            state.value = action.payload
        },
        logout: (state) => {
            Cookies.remove('token')
            state.value = {
                email: '',
                phrase: ''
            }
        }
    }
})

export const { login, logout } = userSlice.actions;

const userStore = configureStore({
  reducer: {
    user: userSlice.reducer,
  }
});
export default userStore