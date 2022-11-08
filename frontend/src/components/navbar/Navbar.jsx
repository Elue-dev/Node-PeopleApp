import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUser, REMOVE_ACTIVE_USER } from "../../redux/authSlice";
import axios from "axios";
import "./navbar.scss";

export default function Navbar() {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutUser = async () => {
    await axios.get("api/auth/logout");
    dispatch(REMOVE_ACTIVE_USER());
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar__contents">
        <div></div>
        <div className="right__nav">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            {user ? (
              <li className="signup" onClick={logOutUser}>
                Logout
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li className="signup">
                  <Link to="/signup">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
