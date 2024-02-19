import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Code, Doc, Header, Loader, Markdown } from "../";
import socket from "./socket";

function File({ user, setUser }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState();
  const [lastChanged, setLastChanged] = useState(false);
  const [openToAll, setOpenToAll] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      socket.connect();
    }, 0);
    return () => {
      setTimeout(() => {
        socket.disconnect();
      }, 0);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      socket.emit("request", {
        docId: window.location.pathname.split("/")[1],
        userEmail: localStorage.getItem("userEmail"),
      });
    }, 0);
    socket.on("response", (data) => {
      if (data.success) {
        document.title = data?.document?.fileName || "Editor-Pro";
        setTimeout(() => {
          setFile(data.document);
          setData(data.document.data);
          setOpenToAll(data.document.openToAll);
        }, 0);
      } else {
        console.error(data.message);
        toast.error(data.message);
        navigate(`/`);
      }
    });
    socket.on("receive", (value) => {
      setTimeout(() => {
        setLastChanged(false);
        setData(value);
      }, 0);
    });
    socket.on("user-joined", (user) => {
      toast.success(`${user} joined...!`);
    });
    socket.on("user-left", (user) => {
      toast.info(`${user} left...!`);
    });
    socket.on("disconnect", (reason) => {
      if (
        reason === "transport error" ||
        reason === "ping timeout" ||
        reason === "transport close" ||
        reason === "parse error"
      ) {
        toast.error(`Connection Lost...!`);
        const interval = setInterval(() => {
          if (socket.connected) {
            setTimeout(() => {
              socket.emit("request", {
                docId: window.location.pathname.split("/")[1],
                userEmail: localStorage.getItem("userEmail"),
              });
              toast.success(`Reconnected...!`);
            }, 0);
            clearInterval(interval);
          } else {
            setTimeout(() => {
              toast.info(`Reconnecting...!`);
              socket.connect();
            }, 0);
          }
        }, 15 * 1000);
      }
    });
    return () => {
      socket.offAny();
    };
  }, []);

  useEffect(() => {
    if (lastChanged) {
      setTimeout(() => {
        setLastChanged(false);
        socket.emit("receive-changes", {
          data: data,
          timestamp: Date.now(),
        });
      }, 0);
    }
  }, [lastChanged, data]);

  if (!file || !socket.connected) return <Loader />;
  return (
    <>
      {file?.type?.value === "text" ? (
        <Doc
          user={user}
          text={data}
          setText={setData}
          setLastChanged={setLastChanged}
          openToAll={openToAll}
          setOpenToAll={setOpenToAll}
        />
      ) : (
        <>
          <Header
            user={user}
            fileName={file?.fileName}
            setUser={setUser}
            isLight={file?.type?.value === "markdown"}
            openToAll={openToAll}
            setOpenToAll={setOpenToAll}
          />
          {file?.type?.value === "markdown" ? (
            <Markdown
              code={data}
              setCode={setData}
              setLastChanged={setLastChanged}
            />
          ) : (
            <Code
              code={data}
              setCode={setData}
              defaultLanguage={file?.type}
              setLastChanged={setLastChanged}
            />
          )}
        </>
      )}
    </>
  );
}

export default File;
