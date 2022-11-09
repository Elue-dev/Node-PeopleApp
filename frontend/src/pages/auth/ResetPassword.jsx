import axios from "axios";
import { useState, useRef } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const initialState = {
  password: "",
  passwordConfirm: "",
};

export default function ResetPassword() {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const passwordRef = useRef();
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { token, id } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleResetPasssword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    if (!values.password || !values.passwordConfirm) {
      setError("Please fill all fields");
      setLoading(false);
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    const data = {
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    };

    let res;

    try {
      res = await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}/${id}`,
        data
      );
      if (res.data.status === "success") {
        setValues(initialState);
        setMessage("Password Reset Successful! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.data);
      }
      setLoading(false);
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
            <h2>Reset your password</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleResetPasssword}>
              {error && <p className="error__message">{error}</p>}
              <label>
                <span>New Password:</span>
                <div className="auth__icon" style={{ marginBottom: ".4rem" }}>
                  <RiLockPasswordLine />
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleInputChange}
                    placeholder="**************"
                  />
                </div>
              </label>
              <label>
                <span>Confirm Password:</span>
                <div className="auth__icon" style={{ marginBottom: ".4rem" }}>
                  <RiLockPasswordLine />
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={values.passwordConfirm}
                    onChange={handleInputChange}
                    placeholder="**************"
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
