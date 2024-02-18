import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Auth, Document, Home, Loader } from "./components";

axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("/api/auth", {
          token: token,
        })
        .then((res) => {
          setUser({
            userName: res?.data?.userName,
            email: res?.data?.email,
          });
          localStorage.setItem("userEmail", res?.data?.email);
          document.title = res.data?.userName || "Editor-Pro";
          toast.success(res.data.message);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("token");
          toast.error(err.response?.data?.message);
          toast.error("Please login again");
          setLoading(false);
        });
    } else {
      setLoading(false);
      toast.warning("Please Login");
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!user ? (
            <Auth setUser={setUser} />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Home user={user} setUser={setUser} />
                    </>
                  }
                />
                <Route
                  path="/:id"
                  element={
                    <>
                      <Document user={user} setUser={setUser} />
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          )}
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
