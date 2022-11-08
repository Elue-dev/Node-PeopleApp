import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { BiUser } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "./auth.scss";
import {
  getUser,
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
} from "../../redux/authSlice";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  // const user = useSelector(getUser);
  const passwordRef = useRef();
  const passwordRef2 = useRef();
  const nameRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const signUpUser = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const userData = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    try {
      setLoading(true);
      const response = await axios.post("api/auth/signup", userData);

      dispatch(SET_ACTIVE_USER(response.data.data.user));

      if (response.data.status === "success") {
        dispatch(REMOVE_ACTIVE_USER());
        setMessage("Signup Successful! Redirecting to Login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => {
    setVisible(!visible);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  const handleConfirmPasswordVisibility = () => {
    setVisible2(!visible2);
    if (passwordRef2.current.type === "password") {
      passwordRef2.current.setAttribute("type", "text");
    } else {
      passwordRef2.current.setAttribute("type", "password");
    }
  };

  return (
    <main>
      <div className="auth">
        <div className="auth__contents">
          <h2>Sign up</h2>
          <form onSubmit={signUpUser}>
            {error && <p className="error__message">{error}</p>}
            {message && <p className="message">{message}</p>}
            <label>
              <span>Username:</span>
              <label>
                <div className="auth__icon" style={{ marginBottom: "1rem" }}>
                  <BiUser />
                  <input
                    type="text"
                    value={username}
                    ref={nameRef}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                </div>
              </label>
            </label>
            <label>
              <span>Email:</span>
              <div className="auth__icon">
                <MdOutlineMail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </label>
            <br />
            <label>
              <span>Password:</span>
              <div className="password__visibility__toggler">
                <RiLockPasswordLine />
                <input
                  type="password"
                  value={password}
                  ref={passwordRef}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <span onClick={handlePasswordVisibility}>
                  {visible ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </span>
              </div>
            </label>
            <br />
            <label>
              <span>Confirm Password:</span>
              <div className="password__visibility__toggler">
                <RiLockPasswordLine />
                <input
                  type="password"
                  value={confirmPassword}
                  ref={passwordRef2}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                <span onClick={handleConfirmPasswordVisibility}>
                  {visible2 ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </span>
              </div>
            </label>
            <br />
            {loading ? (
              <button type="button" disabled>
                <BeatLoader loading={loading} size={10} color={"#fff"} />
              </button>
            ) : (
              <button type="submit">Continue</button>
            )}

            <div className="account">
              Have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
