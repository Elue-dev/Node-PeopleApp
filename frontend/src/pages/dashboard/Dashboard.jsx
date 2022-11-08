import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUser } from "../../redux/authSlice";
import "./dashboard.scss";

export default function Dashboard() {
  const user = useSelector(getUser);

  return (
    <div className="dashboard">
      <div className="dashboard__contents">
        {user ? (
          <h1>Welcome to your Dashboard, {user?.username}</h1>
        ) : (
          <h1>Not logged in</h1>
        )}

        <Link to="/update-password">Update your password</Link>
      </div>
    </div>
  );
}