import axios from "axios";
import { getUser } from "./user.js";

const session_token = await getUser();

const res = (await axios.post('http://localhost:3000/api/auth', {
    intents: 'server',
    server_ip: '127.0.0.1',
    session_token,
})).data;

const token = res.token;

const output = (await axios.get('http://localhost:3000/api/auth?intents=server&token='+token)).data;

console.log(output);