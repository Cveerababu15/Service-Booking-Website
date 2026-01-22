import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "user"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.warning("Please fill all fields");
    }
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 animate-fadeIn">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 px-8 py-8 text-center text-white">
          <h2 className="text-3xl font-bold">Join ServiceHub</h2>
          <p className="mt-1 text-indigo-100">Create your account today</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                placeholder="name@company.com"
                type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                placeholder="••••••••"
                type="password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white outline-none font-medium"
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">Individual User (Client)</option>
                <option value="admin">Service Provider (Admin)</option>
              </select>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full mt-2 py-3 rounded-lg font-bold text-white transition-all shadow-lg ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-[0.98]"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
