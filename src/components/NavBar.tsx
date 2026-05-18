import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../utils/appStore";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import BASE_URL from "../utils/constants";

const NavBar = () => {
    const user = useSelector((store: RootState) => store.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(BASE_URL + "/logout", {}, {
                withCredentials: true,
            });
            dispatch(removeUser());
            navigate("/login");
        } catch(err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="navbar bg-base-300 shadow-sm px-6">
            {/* Left - Logo */}
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    📝 Task Manager
                </Link>
            </div>

            {/* Right - User info + Logout */}
            {user && (
                <div className="flex items-center gap-4">
                    <p className="text-sm">Welcome, {user.name}!</p>
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link to="/task">📋Create Task</Link>
                            </li>
                            <li>
                                <Link to="/all/tasks">📋 All Tasks</Link>
                            </li>
                            <li>
                                <a onClick={handleLogout} className="text-red-400">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Show login button if not logged in */}
            {!user && (
                <Link to="/login" className="btn bg-blue-500 text-white rounded-full px-6">
                    Login
                </Link>
            )}
        </div>
    );
};

export default NavBar;