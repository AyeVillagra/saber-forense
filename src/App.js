import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import SysAdminDashboard from "./components/sysadmin/Sysadmin";
import Admin from "./components/admin/Admin";
import NotFound from "./components/404/NotFound";
import About from "./components/about/About";
import Courses from "./components/courses/Courses";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile", element: <Profile /> },
    { path: "/sysadmin", element: <SysAdminDashboard /> },
    { path: "/admin", element: <Admin /> },
    { path: "*", element: <NotFound /> },
    { path: "/about", element: <About /> },
    { path: "/courses", element: <Courses /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
