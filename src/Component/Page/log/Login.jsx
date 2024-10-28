import React from "react";
import { useState, useContext } from "react";
import AuthContext from "../../context/AuthProvider";

function Login() {
  let { loginUser } = useContext(AuthContext);
  const [auth, setAuth] = useState({
    username: "",
    password: "",
  });
  const { username, password } = auth;
  const onInputAuth = (e) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };
  return (
    <div className="container-md">
      <div
        className=" shadow p-3 mb-5 bg-body rounded mt-5 "
        style={{ width: "60%", margin: "auto" }}
      >
        <h3 className="text-center">Login</h3>
        <form className="" onSubmit={loginUser}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="name@example.com"
              name="username"
              value={username}
              onChange={(e) => {
                onInputAuth(e);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              required
              onChange={(e) => {
                onInputAuth(e);
              }}
            />
          </div>
          <button type="submit" class="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
