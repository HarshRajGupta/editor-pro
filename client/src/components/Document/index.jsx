import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Code, Doc, Header, Loader, Markdown } from "../";
import { AppContext, UserContext } from "../../context";

const stats = (interval) => {
  if (interval.length === 0) return { };
  interval.sort((a, b) => b - a);
  const average = interval.reduce((a, b) => a + b, 0) / interval.length
  return {
    average,
    max: interval[0],
    median: interval[Math.floor(interval.length / 2)],
  }
}

function File({ socket }) {
  const { user } = useContext(UserContext);
  const { file } = useContext(AppContext);
  const [lastChanged, setLastChanged] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  let interval = []

  useEffect(() => {
    setTimeout(() => {
      socket.connect();
    }, 0);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      socket.emit("request", {
        id: window.location.pathname.split("/")[1],
        email: user.email || "Anonymous",
        type: file?.type?.id,
        timestamp: Date.now(),
      });
    }, 0);
    socket.on("response", ({ success, data, message, timestamp }) => {
      if (success) {
        setTimeout(() => {
          setData(data);
          setLoading(false);
          console.info(Date.now() - timestamp);
        }, 0);
      } else {
        console.error(message);
        toast.error(message);
      }
    });
    socket.on("server_to_client", ({ data, timestamp }) => {
      setTimeout(() => {
        setLastChanged(false);
        setData(data);
        interval.push(Date.now() - timestamp);
        console.info("Received Changes!");
        console.debug(stats(interval));
      }, 0);
    });
    socket.on("joined", (user) => {
      toast.success(`${user} joined!`);
    });
    socket.on("left", (user) => {
      toast.info(`${user} left!`);
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
                id: window.location.pathname.split("/")[1],
                email: user.email,
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
        socket.emit("client_to_server", {
          data: data,
          timestamp: Date.now(),
        });
        console.info("Emitting Changes...!");
      }, 0);
    }
  }, [lastChanged, data]);

  if (loading) return <Loader />;
  return (
    <>
      {file?.type?.value === "text" ? (
        <Doc text={data} setText={setData} setLastChanged={setLastChanged} />
      ) : (
        <>
          <Header file={file} />
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
