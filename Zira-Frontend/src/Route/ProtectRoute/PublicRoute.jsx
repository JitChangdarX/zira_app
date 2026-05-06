import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apiurl from "../../../utils/apiurl";

export default function PublicRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("AUTH-X");

      if (!token) {
        setStatus("guest");
        return;
      }

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
          } else {
            localStorage.removeItem("AUTH-X");
            setStatus("guest");
          }
        }
      } catch (err) {
        localStorage.removeItem("AUTH-X");
        setStatus("guest");
      }
    };

    checkAuth();
  }, []);
  if (status === "loading") {
    return null;
  }

  if (status === "auth") {
    return <Navigate to="/create-todo" replace />;
  }

  return children;
}
