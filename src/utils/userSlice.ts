import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

const userSlice = createSlice({
    name: "user",
    initialState: null as User | null,
    reducers: {
        addUser: (_state, action: PayloadAction<User>) => {
            return action.payload;
        },
        removeUser: () => {
            return null;
        },
    },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;