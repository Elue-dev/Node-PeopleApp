import axios from "axios";
import { useState, useRef } from "react";
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { getUser } from "../../redux/authSlice";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const passwordRef = useRef();
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const verifyEmail = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.get(
        `api/auth/send-verification-token/${email}`
      );
      setMessage(response.data.message);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="auth">
          <div className="auth__contents">
            <h2>Verify Email</h2>

            {error && <p className="error__message">{error}</p>}
            {message && <p className="message">{message}</p>}
            <form onSubmit={verifyEmail}>
              <label>
                <span>Email:</span>
                <div className="auth__icon" style={{ marginBottom: ".4rem" }}>
                  <MdOutlineMail />
                  <input
                    type="email"
                    value={email}
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </label>
              {loading ? (
                <button type="button" disabled>
                  <BeatLoader loading={loading} size={10} color={"#fff"} />
                </button>
              ) : (
                <button type="submit">Continue</button>
              )}
              <div className="account">
                <Link to="/login">Back to Login</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
