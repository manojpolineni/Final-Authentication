/* eslint-disable no-empty */
/* eslint-disable react/no-unescaped-entities */
import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visiblePassword, setVisisblePassword] = useState(false);
  const userNameRef = useRef(null);
  const emailRef = useRef(null);

  const clearForm = () => {
    setEmail("");
    setuserName("");
    setPassword("");
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/users/register", {
          userName,
          email,
          password,
        });
        clearForm();

        if (data.success) {
          setIsLoggedIn(true);
          // const token = data.data.token;
          // setAuthToken(token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
          setLoading(false);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/users/login", {
          email,
          password,
        });
        console.log("data", data);

        if (data.success) {
          setIsLoggedIn(true);
          const token = data.data.token;
          sessionStorage.setItem("token", token);
          navigate("/email-verify");
          sendVerificationOtp();
          clearForm();
        } else {
          toast.error(data.message);
          clearForm();
          setLoading(false);
        }
      }
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/users/sendmail");
      if (data.success) {

        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (state === "Sign Up" && userNameRef.current) {
      userNameRef.current.focus();
    } else if (emailRef.current) {
      emailRef.current.focus();
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 xm:left-20 top-5 w-28 xs:w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 tetx-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center mb-6 text-sm">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={handlesubmit}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
              <img src={assets.person_icon} alt="" />

              <input
                className="bg-transparent outline-none w-full"
                type="text"
                ref={userNameRef}
                placeholder="Full Name"
                required
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none w-full"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 relative flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] ">
            <img src={assets.lock_icon} alt="" />

            <input
              className="bg-transparent outline-none"
              type={!visiblePassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              onClick={() => setVisisblePassword(!visiblePassword)}
              className=" absolute right-5 cursor-pointer "
            >
              {visiblePassword ? (
                <FaRegEye size={25} />
              ) : (
                <FaRegEyeSlash size={25} />
              )}
            </span>
          </div>
          <p
            className="mb-4 text-indigo-500 cursor-pointer tetx-sm "
            onClick={() => navigate("/resetpassord")}
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className={`${loading
                ? "bg-gray-300 cursor-not-allowed"
                : "text-lg rounded-full w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
              }`}
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border h-8 w-8 spinner-border-md text-white"
                role="status"
                aria-hidden="true"
              ></span>
            ) : state === "Sign Up" ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="mt-4 text-sm font-light text-gray-400 text-center">
            Already have an Account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline "
              onClick={() => setState("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-sm font-light text-gray-400 text-center">
            Don't have an Account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline "
              onClick={() => setState("Sign Up")}
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
