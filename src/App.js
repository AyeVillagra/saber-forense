import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";

const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile", element: <Profile /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
