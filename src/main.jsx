import React from "react";
import ReactDOM from "react-dom/client";

document.title = import.meta.env.VITE_APP_TITLE || "ErumPay 관리자";

Object.assign(window, { React, ReactDOM });

const service = import.meta.env.VITE_APP_SERVICE || "web-pg";

const importPg = () => import("./web-pg/styles.css")
  .then(() => import("./web-pg/icons.jsx"))
  .then(() => import("./web-pg/components.jsx"))
  .then(() => import("./web-pg/layout.jsx"))
  .then(() => import("./web-pg/data.jsx"))
  .then(() => import("./web-pg/screens/dashboard.jsx"))
  .then(() => import("./web-pg/screens/merchants.jsx"))
  .then(() => import("./web-pg/screens/transactions.jsx"))
  .then(() => import("./web-pg/screens/settlements.jsx"))
  .then(() => import("./web-pg/screens/other.jsx"))
  .then(() => import("./web-pg/app.jsx"));

const importMerchant = () => import("./web-merchant/styles.css")
  .then(() => import("./web-merchant/icons.jsx"))
  .then(() => import("./web-merchant/components.jsx"))
  .then(() => import("./web-merchant/layout.jsx"))
  .then(() => import("./web-merchant/data.jsx"))
  .then(() => import("./web-merchant/screens/dashboard.jsx"))
  .then(() => import("./web-merchant/screens/merchants.jsx"))
  .then(() => import("./web-merchant/screens/sales.jsx"))
  .then(() => import("./web-merchant/screens/transactions.jsx"))
  .then(() => import("./web-merchant/screens/settlements.jsx"))
  .then(() => import("./web-merchant/screens/merchant-info.jsx"))
  .then(() => import("./web-merchant/screens/other.jsx"))
  .then(() => import("./web-merchant/app.jsx"));

(service === "web-merchant" ? importMerchant : importPg)()
  .catch(error => {
    console.error("Failed to load web client service", error);
  });
