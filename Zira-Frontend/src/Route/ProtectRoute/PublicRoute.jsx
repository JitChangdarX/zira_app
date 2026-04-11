import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiurl from "../../../utils/apiurl";

export const PublicRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("AUTH-X");

      try {
        if (token) {
          const res = await fetch(apiurl.user_fetch_api, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth": token,
            },
            credentials: "include",
          });

          if (res.ok) {
            setStatus("auth");
            return;
          }
        }


        const refreshRes = await fetch(apiurl.refresh_token, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          localStorage.removeItem("AUTH-X");
          setStatus("guest");
          return;
        }

        const data = await refreshRes.json();

        localStorage.setItem("AUTH-X", data.X_AUTH);
        setStatus("auth");
      } catch (err) {
        localStorage.removeItem("AUTH-X");
        setStatus("guest");
      }
    };

    checkAuth();
  }, []);


  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "auth") {
    return <Navigate to="/create-todo" replace />;
  }

  return children;
};
