import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const getDashboardPath = () => {
    if (!token) return "/signup";
    return role === "admin" ? "/admin" : "/dashboard";
  };

  const getExplorePath = () => {
    if (!token) return "/login";
    return role === "admin" ? "/admin" : "/dashboard";
  };

  return (
    <div className="min-h-[calc(100vh-104px)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="text-center max-w-3xl mx-auto animate-fadeIn">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Find Professional <span className="text-indigo-600">Services</span> Instantly
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          The all-in-one platform for booking expert services. From home repairs to digital consulting, we've got you covered with trusted professionals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={getDashboardPath()} 
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200"
          >
            {token ? "Go to Dashboard" : "Start Booking Now"}
          </Link>
          <Link 
            to={getExplorePath()} 
            className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold text-lg hover:border-indigo-100 hover:bg-indigo-50 transition-all"
          >
            Explore Services
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="font-bold text-2xl text-gray-400">TRUSTED</div>
          <div className="font-bold text-2xl text-gray-400">RELIABLE</div>
          <div className="font-bold text-2xl text-gray-400">SECURE</div>
          <div className="font-bold text-2xl text-gray-400">FAST</div>
        </div>
      </div>
    </div>
  );
}
