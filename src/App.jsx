import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Campaigns from "@/components/pages/Campaigns";
import Proxies from "@/components/pages/Proxies";
import Settings from "@/components/pages/Settings";
import Activity from "@/components/pages/Activity";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="proxies" element={<Proxies />} />
          <Route path="settings" element={<Settings />} />
          <Route path="activity" element={<Activity />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;