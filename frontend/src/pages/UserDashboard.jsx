import { useEffect, useState, useCallback } from "react";
import { getServices, createBooking, getMyBookings } from "../services/api";
import { toast } from "react-toastify";
import { 
  FiSearch, FiCalendar, FiClock, FiCheckCircle, 
  FiXCircle, FiLoader, FiTag, FiChevronRight 
} from "react-icons/fi";

export default function UserDashboard() {
  const [services, setServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discover"); // 'discover' or 'my-bookings'
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "discover") {
        const res = await getServices(token);
        setServices(res.services || []);
      } else {
        const res = await getMyBookings(token);
        setMyBookings(res.bookings || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const bookService = async (serviceId) => {
    const bookingDate = new Date().toISOString();
    try {
      const res = await createBooking({ serviceId, bookingDate }, token);
      if(res.bookings) {
        toast.success("Booking request sent successfully!");
        if (activeTab === "my-bookings") fetchData();
      } else {
        toast.error(res.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Booking error. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="text-green-500" />;
      case 'accepted': return <FiCheckCircle className="text-blue-500" />;
      case 'rejected': return <FiXCircle className="text-red-500" />;
      default: return <FiLoader className="text-amber-500 animate-spin" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">
            {activeTab === 'discover' ? 'Explore Services' : 'My Schedule'}
          </h2>
          <p className="mt-3 text-gray-500 text-lg font-medium">
            {activeTab === 'discover' 
              ? 'Find and book top-rated professionals' 
              : 'Keep track of your upcoming and past services'}
          </p>
        </div>
        
        <div className="flex bg-indigo-50/50 p-1.5 rounded-[2rem] border border-indigo-100 shadow-sm w-full md:w-auto">
          <button 
            onClick={() => setActiveTab("discover")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3.5 rounded-[1.5rem] font-black transition-all duration-500 ${activeTab === 'discover' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-indigo-600 hover:bg-indigo-100'}`}
          >
            <FiSearch /> Discover
          </button>
          <button 
            onClick={() => setActiveTab("my-bookings")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3.5 rounded-[1.5rem] font-black transition-all duration-500 ${activeTab === 'my-bookings' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-indigo-600 hover:bg-indigo-100'}`}
          >
            <FiCalendar /> My Bookings
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-48">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-indigo-600 border-r-transparent"></div>
            <FiLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-600 animate-pulse" />
          </div>
          <p className="mt-8 text-gray-400 font-black tracking-[0.3em] uppercase text-xs">Loading Marketplace</p>
        </div>
      ) : activeTab === "discover" ? (
        services.length === 0 ? (
          <div className="text-center py-40 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100">
            <FiTag className="text-6xl text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 text-xl font-bold uppercase tracking-widest">No services found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((s) => (
              <div key={s._id} className="group bg-white rounded-[3rem] p-10 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] hover:-translate-y-3 transition-all duration-500 border border-gray-100 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-8 py-3 rounded-bl-[2rem] font-black text-lg">
                  ₹{s.price}
                </div>
                <div className="mt-6 flex-1">
                  <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight">{s.name}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-10 line-clamp-4">{s.description}</p>
                  
                  <div className="flex items-center space-x-4 text-indigo-600 font-black mb-10 bg-indigo-50/50 w-fit px-5 py-2.5 rounded-2xl">
                    <FiClock className="text-xl" />
                    <span className="text-sm uppercase tracking-widest">{s.duration} Minutes</span>
                  </div>
                </div>

                <button
                  onClick={() => bookService(s._id)}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-[1.8rem] group-hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  Book Service <FiChevronRight />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        myBookings.length === 0 ? (
          <div className="text-center py-40 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100">
            <div className="bg-white h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FiCalendar className="text-4xl text-gray-300" />
            </div>
            <p className="text-gray-400 text-xl font-bold uppercase tracking-widest mb-8">No active bookings</p>
            <button 
              onClick={() => setActiveTab('discover')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              Browse Services Now
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {myBookings.map((b) => (
              <div key={b._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8 hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-8 w-full lg:w-auto">
                  <div className={`h-20 w-20 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner shrink-0 ${
                    b.status === 'completed' ? 'bg-green-50' : 
                    b.status === 'rejected' ? 'bg-red-50' : 
                    b.status === 'accepted' ? 'bg-blue-50' : 'bg-amber-50'
                  }`}>
                    {getStatusIcon(b.status)}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-gray-900 mb-1">{b.serviceId?.name || 'Service Archieved'}</h4>
                    <p className="text-gray-400 font-bold flex items-center gap-2">
                      <FiCalendar className="text-indigo-400" />
                      {new Date(b.bookingDate).toLocaleDateString(undefined, { dateStyle: 'full' })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-black uppercase tracking-widest flex items-center gap-2">
                      <FiClock className="text-indigo-400" />
                      {new Date(b.bookingDate).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Investment</p>
                    <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{b.serviceId?.price || 0}</p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-sm border ${
                    b.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                    b.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                    b.status === 'accepted' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {b.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
