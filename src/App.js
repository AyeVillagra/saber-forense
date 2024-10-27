import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import SysAdminDashboard from "./components/sysadmin/Sysadmin";
import NotFound from "./components/404/NotFound";
import About from "./components/about/About";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile", element: <Profile /> },
    { path: "/sysadmin", element: <SysAdminDashboard /> },
    { path: "*", element: <NotFound /> },
    { path: "/about", element: <About /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
