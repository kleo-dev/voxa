import axios from "axios";

// Create a temp token
axios.post('http://localhost:3000/api/auth', {
    intents: 'server',
    server_ip: 'localhost'
}).then((r) => {
    console.log(r.data);
}).catch((e) => {
    console.log(e);
});