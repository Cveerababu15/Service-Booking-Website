import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  
  if (!token) return <Navigate to="/login" />;

  let userRole = null;
  try {
    const userData = JSON.parse(atob(token.split(".")[1]));
    userRole = userData.role;
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  if (role && role !== userRole) {
    return <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} />;
  }

  return children;
}
