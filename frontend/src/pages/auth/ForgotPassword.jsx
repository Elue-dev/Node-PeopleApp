import axios from "axios";
import { useState, useRef } from "react";
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const passwordRef = useRef();
  const emailRef = useRef(null);
  const navigate = useNavigate();

  const handleResetPasssword = async (e) => {
    e.preventDefault();

    setMessage(null);
    setError(null);
    setLoading(true);

    if (!email) {
      setError("Please enter your email");
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const res = await axios.post("api/auth/forgot-password", {
        email: email,
      });
      console.log(res.data);
      if (res.data.status === "success") {
        setMessage(res.data.message);
        setToken(res.data.token);
        setLoading(false);
        // navigate(`/reset-password/${res.data.token}/${res.data.userId}`);
      }
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="auth">
          <div className="auth__contents">
            <h2>Forgot password</h2>
            {/* <div className="reset__info">
              <p>
                If the email goes to your spam folder, click on{" "}
                <b>'Report as not spam'</b>, this will move the mail from spam
                to your inbox. then go to your inbox and continue from there.
              </p>
            </div> */}

            {error && <p className="error__message">{error}</p>}
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleResetPasssword}>
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
