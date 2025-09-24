import axios from "axios";
import { getUser } from "./user.js";

export async function auth(session_token, server_ip) {
    const res = (await axios.post('http://localhost:3000/api/auth', {
        server_ip,
        session_token,
    })).data;

    return res.token;
}

// const session_token = await getUser();

// const token = await auth(session_token);

// const output = (await axios.get('http://localhost:3000/api/auth?intents=server&token='+token)).data;

// console.log(output);