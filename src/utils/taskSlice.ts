import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "./types";

const taskSlice = createSlice({
    name: "tasks",
    initialState: [] as Task[],
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.push(action.payload);
        },
        setTask: (_state, action: PayloadAction<Task[]>) => {
            return Array.isArray(action.payload) ? action.payload : [];
        },
        removeTask: (state, action: PayloadAction<string>) => {
            return state.filter((task) => task._id !== action.payload);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            return state.map((task) =>
                task._id === action.payload._id ? action.payload : task
            );
        },
    },
});

export const { addTask, setTask, removeTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;