import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AppLayout from "../layout/AppLayout";
import AuthLayout from "../layout/AuthLayout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Pets from "../pages/Pets";
import WalkingMates from "../pages/WalkingMates";
import WalkingMateDetail from "../pages/WalkingMateDetail";
import Routes from "../pages/Routes";
import Facilities from "../pages/Facilities";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "pets",
        element: <Pets />,
      },
      {
        path: "walking-mates",
        element: <WalkingMates />,
      },
      {
        path: "walking-mates/:id",
        element: <WalkingMateDetail />,
      },
      {
        path: "routes",
        element: <Routes />,
      },
      {
        path: "facilities",
        element: <Facilities />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
