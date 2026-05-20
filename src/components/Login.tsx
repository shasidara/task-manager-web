import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../utils/appStore";
import { addUser } from "../utils/userSlice";
import BASE_URL from "../utils/constants";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const res = await axios.post(BASE_URL + "/login", {
                email,
                password,
            }, { withCredentials: true });
            dispatch(addUser(res.data.data));
            navigate("/");
        } catch(err) {
            if(axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Login failed");
            }
        } 
    };

    const handleSignUp = async () => {
        setError("");
        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        try {
            const res = await axios.post(BASE_URL + "/signup", {
                name,
                email,
                password,
            }, { withCredentials: true });
            dispatch(addUser(res.data.data));
            navigate("/");
        } catch(err) {
            if(axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Signup failed");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="card bg-base-300 w-96 shadow-xl rounded-2xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-4">
                        {isLoginForm ? "🔐 Login" : "📝 Sign Up"}
                    </h2>

                    {!isLoginForm && (
                        <label className="my-2">
                            <p className="text-sm mb-1">Name</p>
                            <input
                                type="text"
                                className="input input-md w-full"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                    )}

                    <label className="my-2">
                        <p className="text-sm mb-1">Email</p>
                        <input
                            type="email"
                            className="input input-md w-full"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label className="my-2">
                        <p className="text-sm mb-1">Password</p>
                        <input
                            type="password"
                            className="input input-md w-full"
                            placeholder={isLoginForm ? "Enter your password" : "Min 6 characters"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                    <div className="card-actions justify-center mt-4">
                        <button
                            className="btn bg-blue-500 hover:bg-blue-600 text-white px-10 rounded-full"
                            onClick={isLoginForm ? handleLogin : handleSignUp}
                        >
                            {isLoginForm ? "Login" : "Sign Up"}
                        </button>
                    </div>

                    <p
                        className="text-center text-sm mt-4 cursor-pointer text-blue-400 hover:underline"
                        onClick={() => setIsLoginForm((value) => !value)}
                    >
                        {isLoginForm
                            ? "New user? Sign Up here"
                            : "Existing user? Login here"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;