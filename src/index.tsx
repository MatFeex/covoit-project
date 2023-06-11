import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/app";
import {AuthProvider} from "./app/context/AuthContext";

import "./app/style/style.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
