import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// ✅ Lazy ONLY pages
const Organization = lazy(() => import("../Component/Organization"));
const Todo = lazy(() => import("../Component/Todo"));
const ZiraIndex = lazy(() => import("../Component/ZiraIndex"));
const ZiraSignup = lazy(() => import("../Component/ZiraSignup"));

// ✅ Normal import (IMPORTANT)
import PublicRoute from "./ProtectRoute/PublicRoute";
import ProtectedRoute from "./ProtectRoute/ProtectedRoute";
import BestLoader from "./ProtectRoute/BestLoader";
import { Signin } from "../Component/Signin";

export const AppRoutes = () => {
  return (
    <Suspense fallback={<BestLoader />}>
      <Routes>
        <Route path="/" element={<ZiraIndex />} />

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
              <Organization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-todo"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />

        <Route path="signin" element={<Signin />} />
      </Routes>
    </Suspense>
  );
};
