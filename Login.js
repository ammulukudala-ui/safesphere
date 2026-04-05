import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const login = async () => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    setUser(res.user);
  };

  const signup = async () => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    setUser(res.user);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPass(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>
      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default Login;