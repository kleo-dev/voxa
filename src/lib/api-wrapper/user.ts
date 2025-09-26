import axios from "axios";

export async function getUser() {
  console.log((await axios.delete("http://localhost:3000/api/user", {
    data: { username: "leo" },
  })).data);

  return ((await axios.post('http://localhost:3000/api/user', {
      username: 'leo',
      name: 'Leo',
      email: '',
      password: 'Idk123',
  })).data).token;
}

// await getUser();