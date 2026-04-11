import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiurl from "../../../utils/apiurl";

export const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  const token = localStorage.getItem("AUTH-X");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuth(false);
        return;
      }

      const res = await fetch(apiurl.user_fetch_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": token,
        },
        credentials: "include",
      });

      if (res.ok) {
        setIsAuth(true);
      } else if (res.status === 401) {
        // try refresh
        const refreshRes = await fetch(apiurl.refresh_token, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          localStorage.removeItem("AUTH-X");
          setIsAuth(false);
          return;
        }

        const data = await refreshRes.json();

        localStorage.setItem("AUTH-X", data.X_AUTH);
        setIsAuth(true);
      } else {
        localStorage.removeItem("AUTH-X");
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [token]);

  if (isAuth === null) return null; // or loader

  if (!isAuth) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};
