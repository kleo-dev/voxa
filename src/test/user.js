import axios from "axios";

console.log((await axios.delete("http://localhost:3000/api/user", {
  data: { username: "leo" },
})).data);

console.log((await axios.post('http://localhost:3000/api/user', {
    username: 'leo',
    name: 'Leo',
    email: '',
    password: 'Idk123',
})).data);
