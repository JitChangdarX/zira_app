import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Organization } from "../Component/Organization";
import Todo from "../Component/Todo";
import { ProtectedRoute } from "./ProtectRoute/ProtectedRoute";
import { PublicRoute } from "./ProtectRoute/PublicRoute";
import ZiraIndex from "../Component/ZiraIndex";

const ZiraSignup = lazy(() => import("../Component/ZiraSignup"));

export const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>

          <Route
          path="/"
          element={
              <ZiraIndex />
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <ZiraSignup />
            </PublicRoute>
          }
        />

        <Route
          path="/organization/:id"
          element={
            <ProtectedRoute>
              {" "}
              <Organization />
            </ProtectedRoute>
          }
        />

        <Route path="/create-todo" element={
           <ProtectedRoute>
          <Todo />
          </ProtectedRoute>
          } />
      </Routes>
    </Suspense>
  );
};
