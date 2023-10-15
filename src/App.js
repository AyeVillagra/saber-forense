import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";

const App = () => {
  const router = createBrowserRouter([{ path: "/", element: <Home /> }]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
