import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../utils/appStore";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((store: RootState) => store.user);
    const [ loading, setLoading ] = useState<boolean>(true);

    const fetchUser = async () => {
        try{
            const res = await axios.get(BASE_URL + "/profile", {
                withCredentials: true,
            });
            dispatch(addUser(res?.data?.data));
        }catch(err) {
            navigate("/login");
        }finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        if(!user){
            fetchUser();
        } else{
            setLoading(false);
        };
    },[]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <div className="text-4xl">📝</div>
                <p className="text-xl font-bold">Task Manager</p>
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
                <p className="text-sm text-gray-400">
                    Loading... Please wait
                </p>
            </div>
        );
    };

    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default Body;