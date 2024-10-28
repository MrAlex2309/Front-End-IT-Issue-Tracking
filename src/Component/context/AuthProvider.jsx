import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  let [user, setUser] = useState(
    localStorage.getItem("authToken")
      ? jwt_decode(localStorage.getItem("authToken"))
      : null
  );
  let [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );
  let [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh")
      ? JSON.parse(localStorage.getItem("refresh"))
      : null
  );
  let [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [permissionArr, setpermissionArr] = useState([]);
  const login = async (e) => {
    e.preventDefault();
    const log = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}:${
        import.meta.env.VITE_API_PORT
      }/api/sign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log),
      }
    ).catch((e) => console.log(e));
    let datas = await response.json();
    if (response.status === 200) {
      setUserInfo(datas);
      setpermissionArr(datas.permissions);
      setRefreshToken(datas.refresh);
      setAuthToken(datas);
      setUser(jwt_decode(datas.access));

      const names = datas.permission;
      const name = [];
      names.map((e) => {
        name.push(e.name);
      });
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          name: datas.name,
          profile: datas.profile,
          username: datas.firstName+" "+datas.lastName,
          id: datas.id,
          Permissions: name,
        })
      );
      localStorage.setItem("refresh", JSON.stringify(datas.refresh));
      localStorage.setItem("authToken", JSON.stringify(datas.access));
      if (datas.id === 14) {
        navigate("/CardReport");
      } else {
        navigate("/");
      }
    } else {
      alert("No active account found with the given credentials");
    }
  };

  let logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };
  let context = {
    user: user,
    authToken: authToken,
    logoutUser: logout,
    userInfo: userInfo,
    loginUser: login,
    permission: permissionArr,
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
