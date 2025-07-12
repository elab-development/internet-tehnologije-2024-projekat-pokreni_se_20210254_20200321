import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import EditEvent from "../pages/EditEvent";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import MyEvents from "../pages/MyEvents";
import CreateEvent from "../pages/CreateEvent";
import EventDetails from "../pages/EventDetails";

const PrivateRoute = ({ element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  return localStorage.getItem("token") && isAdmin ? element : <Navigate to="/" />;
};

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/my-events" element={<PrivateRoute element={<MyEvents />} />} />
        <Route path="/create-event" element={<PrivateRoute element={<CreateEvent />} />} />
        <Route path="/edit-event/:id" element={<PrivateRoute element={<EditEvent />} />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
      </Routes>
    </>
  );
};

export default AppRouter; 