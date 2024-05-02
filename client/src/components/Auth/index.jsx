import axios from "axios";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import newAuth from "../../assets/images/newAuth.svg";
import { UserContext } from "../../context";
import styles from "./auth.module.css";

function Auth() {
  const { setUser } = useContext(UserContext);
  const [page, setPage] = useState("login");
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const rememberMeRef = useRef();
  const termsRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const validate = () => {
    if (!emailRef.current.value || emailRef.current.value === "") {
      setError((prev) => ({ ...prev, email: "Please enter your email" }));
      return false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.+[^\s@]{2,}$/i.test(emailRef.current.value)
    ) {
      setError((prev) => ({
        ...prev,
        email: "Please enter a valid email",
      }));
      return false;
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }
    if (!passwordRef.current.value || passwordRef.current.value === "") {
      setError((prev) => ({
        ...prev,
        password: "Please enter your password",
      }));
      return false;
    } else if (passwordRef.current.value.length < 8) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return false;
    } else {
      setError((prev) => ({ ...prev, password: "" }));
    }
    if (
      page === "register" &&
      (!nameRef.current.value || nameRef.current.value === "")
    ) {
      setError((prev) => ({
        ...prev,
        name: "Please enter your name",
      }));
      return false;
    } else {
      setError((prev) => ({ ...prev, name: "" }));
    }
    if (page === "register" && !termsRef.current.checked) {
      setError((prev) => ({
        ...prev,
        terms: "Required",
      }));
      return false;
    } else {
      setError((prev) => ({ ...prev, terms: "" }));
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      return setLoading(false);
    }
    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    if (page === "register") {
      user.name = nameRef.current.value;
    }
    try {
      await axios
        .post(`/api/auth/${page}`, user)
        .then((res) => {
          setLoading(false);
          if (rememberMeRef.current.checked)
            localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common["authorization"] = res.data.token;
          toast.success(res.data.message);
          document.title = res.data?.user?.name || "Editor-Pro";
          return setUser(res.data?.user);
        })
        .catch((err) => {
          setLoading(false);
          if (!err.response) {
            toast.error("Something went wrong!");
          } else {
            toast.error(err.response?.data?.message);
          }
          console.error(err);
        });
    } catch (err) {
      setLoading(false);
      if (!err.response) {
        toast.error("Something went wrong!");
      } else {
        toast.error(err.response?.data?.message);
      }
      return console.error(err);
    }
  };
  const loginAsGuest = async () => {
    setLoading(true);
    toast.info("Logging in as Guest");
    try {
      await axios
        .get(`/api/auth/guest`)
        .then((res) => {
          document.title = "Editor-Pro";
          toast.warning(
            "Please note that your data will be lost after you logout!",
          );
          axios.defaults.headers.common["authorization"] = res.data.token;
          setUser(res.data?.user);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong!");
        });
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className={styles.container}>
      <div className={styles.left}>
        <img src={newAuth} alt="Image" />
      </div>
      <div className={styles.right}>
        <form action={"/"} onSubmit={handleSubmit}>
          <h1>{page}</h1>
          {page === "register" ? (
            <div className={styles.grid}>
              <label htmlFor="name">Name</label>
              <input
                required
                type="text"
                name="name"
                placeholder="Please Enter you Name"
                disabled={loading}
                ref={nameRef}
                className={loading ? "opacity-50 cursor-wait" : ""}
                autoComplete="Jhon Doe"
              />
              {error.name && <div className={styles.error}>{error.name}</div>}
            </div>
          ) : (
            <></>
          )}
          <div className={styles.grid}>
            <label htmlFor="email">Email ID</label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter Email ID"
              ref={emailRef}
              disabled={loading}
              className={loading ? "opacity-50 cursor-wait" : ""}
              autoComplete="example@mail.com"
            />
            {error.email && <div className={styles.error}>{error.email}</div>}
          </div>
          <div className={styles.grid}>
            <label htmlFor="password">Password</label>
            <input
              required
              placeholder="Password"
              type="password"
              name="password"
              disabled={loading}
              ref={passwordRef}
              className={loading ? "opacity-50 cursor-wait" : ""}
              autoComplete="password"
            />
            {error.password && <div className={styles.error}>{error.password}</div>}
          </div>
          <div className={loading ? `${styles.box} opacity-75 cursor-wait` : styles.box}>
            <input
              type="checkbox"
              name="rememberMe"
              disabled={loading}
              ref={rememberMeRef}
            />
            <span htmlFor="rememberMe">Remember me</span>
          </div>
          {page === "register" ? (
            <div className={loading ? `${styles.box} opacity-75 cursor-wait` : styles.box}>
              <input
                type="checkbox"
                name="terms"
                disabled={loading}
                ref={termsRef}
              />
              <span htmlFor="terms">
                Agree to&nbsp;
                <a
                  target="__blank"
                  href="https://docs.google.com/document/d/1C2TUPEbnozRSuMhp4Xur7H4Vy97LOaNOeZDxSKYmLG0/edit?usp=sharing"
                >
                  Terms and Conditions
                </a>
                &nbsp;
              </span>
              {error.terms && <div className={styles.error}>{error.terms}</div>}
            </div>
          ) : (
            <></>
          )}
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className={loading ? "opacity-75 cursor-wait" : ""}
          >
            {page}
          </button>
          {page === "login" ? (
            <a>
              Don`t have an account? &nbsp;{" "}
              <span
                onClick={() => {
                  setPage("register");
                }}
              >
                Register Here
              </span>
            </a>
          ) : (
            <a>
              Already have an account? &nbsp;{" "}
              <span
                onClick={() => {
                  setPage("login");
                }}
              >
                Login Here
              </span>
            </a>
          )}
          <a>
            <span onClick={loginAsGuest}>Login as Guest</span>
          </a>
        </form>
      </div>
    </main>
  );
}

export default Auth;
