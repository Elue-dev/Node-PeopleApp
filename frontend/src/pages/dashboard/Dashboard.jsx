import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { getUser } from "../../redux/authSlice";
import "./dashboard.scss";

export default function Dashboard() {
  const user = useSelector(getUser);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard__contents">
          {user ? (
            <h1>Welcome to your Dashboard, {user?.username}</h1>
          ) : (
            <h1>Not logged in</h1>
          )}
          <br />
          <div>
            <div className="updates">
              <Link to="/update-password" className="update">
                Update your password
              </Link>
              {/* show this conditionally, if the user has verified their email */}
              <button className="update">Verify Email Address</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
