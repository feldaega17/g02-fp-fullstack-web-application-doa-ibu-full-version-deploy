import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              authUser.role === "Admin" ? (
                <Navigate to={"/dashboard"} />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={authUser ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={
            authUser && authUser.role === "Admin" ? (
              <Dashboard />
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
