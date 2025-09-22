import axios from "axios";

const res = (await axios.post('http://localhost:3000/api/auth', {
    intents: 'server',
    server_ip: 'localhost'
})).data;

const token = res.token;

const output = (await axios.get('http://localhost:3000/api/auth?intents=server&token='+token)).data;

console.log(output);