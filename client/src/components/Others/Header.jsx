import { useContext, useState } from "react";
import { Moodle } from "../";
import { Logo } from "../../assets";
import { UserContext } from "../../context";

function Header({ file }) {
  const { user, setUser } = useContext(UserContext);
  const [showMoodle, setShowMoodle] = useState(false);
  const logOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  const docId = window.location.pathname.split("/")[1];
  let bg1 = "white",
    bg2 = "[#1f1e1f]";
  if (file?.type === "markdown" || !file) {
    bg1 = "[#1f1e1f]";
    bg2 = "white";
  }
  return (
    <>
      {showMoodle && <Moodle setShowMoodle={setShowMoodle} />}
      <nav className={`border-gray-200 bg-${bg2} z-10`}>
        <div className="flex  justify-between items-center mx-auto w-screen py-[2vh] px-[4vw]">
          <div className="flex items-center">
            <img src={Logo} className="h-8 mr-3" alt="Flowbite Logo" />
            <span
              className={`font-["Comic_Sans_MS"] self-center text-xl font-semibold whitespace-nowrap text-${bg1}`}
            >
              {file?.name || user?.name}
            </span>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => setShowMoodle(true)}
              className={`mr-6 text-sm text-${bg1} hover:underline cursor-pointer`}
            >
              {docId ? "Share" : ""}
            </div>
            {user ? (
              <>
                <div
                  onClick={logOut}
                  className={`text-sm text-${bg2}  hover:underline rounded-md px-4 py-1 bg-${bg1} cursor-pointer`}
                >
                  Logout
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
