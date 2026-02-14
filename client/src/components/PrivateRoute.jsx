import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    toast.error("Please login to access dashboard");
    return <Navigate to="/" replace />;
  }

  // Optionally, you can verify token here synchronously
  // or just rely on backend protecting the route
  return children;
}
