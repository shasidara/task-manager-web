import { createSlice } from "@reduxjs/toolkit";
import type { Task } from "./types";
import type { PayloadAction } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: "task",
    initialState: [] as Task[],
    reducers: {
        addTask: (_state, action: PayloadAction<Task[]>) => {
            return action.payload;
        },
        setTask: (_state, action: PayloadAction<Task[]>) => {
            return action.payload;
        },
        removeTask: (_state, action: PayloadAction<string>) => {
            return _state.filter((task) => task._id !== action.payload)
        },
        updateTask: (_state, action: PayloadAction<Task>) => {
            return _state.map((task) =>
                task._id === action.payload._id ? action.payload : task
            )
        }
    },
});

export const { addTask, setTask, removeTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;