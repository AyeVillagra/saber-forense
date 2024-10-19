import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import SysAdminDashboard from "./components/sysadmin/Sysadmin";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile", element: <Profile /> },
    { path: "/sysadmin", element: <SysAdminDashboard /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
