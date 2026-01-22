import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiLogOut, FiUser, FiSettings, FiHome } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role")
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")
      });
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const { token, role } = auth;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <FiHome className="text-white text-xl" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-indigo-600">
              Service<span className="text-gray-900">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <FiHome /> Home
            </Link>

            {!token && (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Login</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </>
            )}

            {token && role === "user" && (
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <FiUser /> Dashboard
              </Link>
            )}

            {token && role === "admin" && (
              <Link to="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <FiSettings /> Admin Panel
              </Link>
            )}

            {token && (
              <button 
                onClick={logout} 
                className="text-red-500 hover:text-red-700 transition-colors border border-red-100 px-4 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1"
              >
                <FiLogOut /> Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-fadeIn">
          <div className="px-4 pt-2 pb-6 space-y-2 font-bold">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-base text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <FiHome /> Home
            </Link>
            
            {!token ? (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base text-white bg-indigo-600 text-center shadow-lg shadow-indigo-100"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to={role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-base text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {role === 'admin' ? <FiSettings /> : <FiUser />}
                  {role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-base text-red-600 hover:bg-red-50"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
