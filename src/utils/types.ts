export interface Task {
    _id?: string;
    title: string;
    description?: string;
    status: "to-do" | "in-progress" | "done";
    targetDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
}