import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
const Organization = lazy(() => import("../Component/Organization"));
const Todo = lazy(() => import("../Component/Todo"));
const ZiraIndex = lazy(() => import("../Component/ZiraIndex"));
const ZiraSignup = lazy(() => import("../Component/ZiraSignup"));
const Signin = lazy(() => import("../Component/Signin"));
const InvitePage = lazy(() => import("../Component/InvitePage"));
import PublicRoute from "./ProtectRoute/PublicRoute";
import ProtectedRoute from "./ProtectRoute/ProtectedRoute";
import BestLoader from "./ProtectRoute/BestLoader";

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

        <Route path="/invite/:inviteId/:authToken" element={<InvitePage />} />

        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Suspense>
  );
};
