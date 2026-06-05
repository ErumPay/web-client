import React from "react";
import ReactDOM from "react-dom/client";
import "./web-pg/styles.css";

document.title = import.meta.env.VITE_APP_TITLE || "ErumPay 어드민 - 슈퍼바이저";

Object.assign(window, { React, ReactDOM });

import("./web-pg/icons.jsx")
  .then(() => import("./web-pg/components.jsx"))
  .then(() => import("./web-pg/layout.jsx"))
  .then(() => import("./web-pg/data.jsx"))
  .then(() => import("./web-pg/screens/dashboard.jsx"))
  .then(() => import("./web-pg/screens/merchants.jsx"))
  .then(() => import("./web-pg/screens/transactions.jsx"))
  .then(() => import("./web-pg/screens/settlements.jsx"))
  .then(() => import("./web-pg/screens/other.jsx"))
  .then(() => import("./web-pg/app.jsx"));
