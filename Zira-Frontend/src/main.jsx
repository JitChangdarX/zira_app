import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import userStore from "../utils/userStore.js";
createRoot(document.getElementById("root")).render(
  <Provider store={userStore}>
    <App />
  </Provider>,
);
