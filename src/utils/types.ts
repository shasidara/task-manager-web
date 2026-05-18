export interface Task {
    _id?: string;
    title: string;
    description?: string;
    status: "to-do" | "in-progress" | "done";
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
}