import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../utils/appStore";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((store: RootState) => store.user);

    const fetchUser = async () => {
        try{
            const res = await axios.get(BASE_URL + "/profile", {
                withCredentials: true,
            });
            dispatch(addUser(res?.data?.data));
        }catch(err) {
            navigate("/login");
        };
    };

    useEffect(() => {
        if(!user){
            fetchUser();
        }
    },[]);

    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default Body;