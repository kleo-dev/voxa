import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export interface User {
    id: number;
    username: string;
    email: string;
}

export default function getUser() {
    const [user, setUser] = useState<undefined | User>();
    
    useEffect(() => {
        async function fetchUser() {
            const token = Cookies.get("token");

            if (!token) {
                redirect('/login')
            }

            const res = (await axios.get('http://localhost:3000/api/user', {
                params: { token }
            })).data as User;

            setUser(res);
        }
    
        fetchUser();
    });

    return user;
}
