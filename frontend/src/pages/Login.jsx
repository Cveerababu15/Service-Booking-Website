import { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return toast.warning("Email and Password are required");
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        const userData = JSON.parse(atob(res.token.split(".")[1]));
        localStorage.setItem("role", userData.role);
        window.dispatchEvent(new Event("authChange"));
        toast.success(`Welcome back, ${userData.name || 'User'}!`);
        navigate(userData.role === "admin" ? "/admin" : "/dashboard");
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 animate-fadeIn">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 px-8 py-10 text-center text-white">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-indigo-100">Sign in to manage your bookings</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input 
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            <button 
              onClick={handleLogin} 
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-lg ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-[0.98]"
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
