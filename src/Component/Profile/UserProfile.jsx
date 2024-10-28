import React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    height: "15px",
    borderRadius: "50%",
    width: "15px",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function UserProfile() {
  const { userInfo } = useContext(AuthContext);
  console.log(userInfo);
  return (
    <div>
      <h2 className="m-4">Profile</h2>
      <div
        className="p-2"
        style={{
          backgroundColor: "#e7e9ed",
          borderRadius: "10px",
          margin: "10px",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt="Remy Sharp"
                src={`${import.meta.env.VITE_API_URL}:${
                  import.meta.env.VITE_API_PORT
                }${userInfo.profile}`}
                sx={{ width: 100, height: 100 }}
              />
            </StyledBadge>
            <button className="btn btn-primary mt-3  btn-sm">
              Edit Profile
            </button>
          </div>
          <div>
            <h3>{userInfo.name}</h3>
            <h5>IT Officer</h5>
            <h5>KTS RUSSEY KEO BUILDING</h5>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default UserProfile;
