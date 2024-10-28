import React, { useEffect } from "react";
import Nav from "./Component/Content/content-list";
import NavigationBar from "./Component/Content/NavigationBar";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Component/Page/Home/Home";
import IssueCus from "./Component/Page/IssueAddingCus/IssueCus";
import IssueInter from "./Component/Page/IssueAddingInter/IssueInter";
import CaseView from "./Component/Page/CaseView/CaseView";
import MainDash from "./Component/Page/DashBoard/MainDash";
import Login from "./Component/Page/log/Login";
import { useContext, useState } from "react";
import AuthContext from "./Component/context/AuthProvider";
import SeriousIssue from "./Component/Page/IssueAddingSeriousCase/SeriousCase";
import CardView from "./Component/Page/CaseView/CardView";
import HighCase from "./Component/Report/HighCase";
import DataTable from "./Component/Report/DataTable";
import UserChangePassword from "./Component/Profile/UserChangePassword";
import PrivateRoute from "./Component/context/ProtectedRoute";
import AddClient from "./Component/Page/Client/AddClient";
import UserProfile from "./Component/Profile/UserProfile";
import RepoPrivateRoute from "./Component/context/RepoPrivateRoute";
import MonthlyReports from "./Component/Page/MontlyReport/MonthlyReports";
import MonthlyReportView from "./Component/Page/MontlyReport/MonthlyReportView";
import UserManage from "./Component/Page/User/UserManage";
function App() {
  const { user } = useContext(AuthContext);
  const { userInfo } = useContext(AuthContext);
  const [prev, setPrev] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleData = (data) => {
    setPrev(data);
  };
  const style = {
    marginLeft: prev ? "80px" : "270px",
    height: "100%",
  };

  const mainClass = windowWidth<576 ? "mt-0":"d-flex justify-content-center mt-0"

  return (
    <>
      {user ? (
        <div className={mainClass} style={{ height: "100%"}}>
          <div className={windowWidth <= 576 ? "d-none" : ""}>
            <Nav onData={handleData} />
          </div>

          <div className="container-fluid p-0 " style={windowWidth > 576 ? style : {}}>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/issueCus" element={<IssueCus />} />
                <Route path="/issueInter" element={<IssueInter />} />
                <Route path="/report" element={<DataTable />} />
                <Route path="/monthly-report" element={<MonthlyReports />} />
                <Route path="/monthly-report/:id" element={<MonthlyReportView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<UserManage />} />
                <Route path="/report/Detail/:id" element={<CaseView />} />
                <Route element={<RepoPrivateRoute />}>
                  <Route path="/client" element={<AddClient />} />
                </Route>
                <Route path="/user" element={<UserProfile />} />
                <Route
                  path="/user/changepassword"
                  element={<UserChangePassword />}
                />
                <Route path="/" element={<MainDash />} />
              </Route>
              <Route path="/CardReport/:id" element={<CardView />} />
              <Route path="/Card" element={<SeriousIssue />} />
              <Route path="/CardReport" element={<HighCase />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
