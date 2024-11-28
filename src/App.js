import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import SysAdminDashboard from "./components/sysadmin/Sysadmin";
import Admin from "./components/admin/Admin";
import NotFound from "./components/404/NotFound";
import About from "./components/about/About";
import Courses from "./components/courses/Courses";
import { useUser } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { user } = useUser();

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile", element: <Profile /> },
    {
      path: "/sysadmin",
      element: user?.role === "SYSADMIN" ? <SysAdminDashboard /> : <NotFound />,
    },
    {
      path: "/admin",
      element: user?.role === "ADMIN" ? <Admin /> : <NotFound />,
    },
    { path: "*", element: <NotFound /> },
    { path: "/about", element: <About /> },
    { path: "/courses", element: <Courses /> },
  ]);

  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
