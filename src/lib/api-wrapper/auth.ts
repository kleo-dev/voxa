import axios from "axios";

export async function auth(session_token: string, server_ip: string) {
    const res = (await axios.post('http://localhost:3000/api/auth', {
        server_ip,
        session_token,
    })).data;

    return (res as any).token;
}
