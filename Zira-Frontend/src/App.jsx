import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./Route/AppRoutes";
import { useEffect, useRef } from "react";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
