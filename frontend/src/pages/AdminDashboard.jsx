import { useState, useEffect, useCallback } from "react";
import { createService, getAllBookingsAdmin, updateBookingStatus } from "../services/api";
import { toast } from "react-toastify";
import { 
  FiPlus, FiList, FiCheckCircle, FiXCircle, FiClock, 
  FiTool, FiDollarSign, FiZap, FiCalendar, FiUser, 
  FiMail, FiActivity 
} from "react-icons/fi";

export default function AdminDashboard() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services"); // 'services' or 'bookings'

  const token = localStorage.getItem("token");

  const fetchBookings = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await getAllBookingsAdmin(token);
      setBookings(res.bookings || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching bookings");
    } finally {
      setFetchLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.duration) return toast.warning("Name, price and duration are required");
    setLoading(true);
    try {
      await createService(form, token);
      toast.success("Service published successfully!");
      setForm({ name: "", description: "", price: "", duration: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error creating service");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status, token);
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Admin Control Panel</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your services and customer requests</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner w-full md:w-auto">
          <button 
            onClick={() => setActiveTab("services")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'services' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiPlus /> Services
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'bookings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiList /> Bookings
          </button>
        </div>
      </div>

      {activeTab === "services" ? (
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 grid lg:grid-cols-5">
          <div className="lg:col-span-2 bg-indigo-600 p-10 text-white flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FiTool /> Service Factory
            </h3>
            <p className="text-indigo-100 leading-relaxed mb-10 text-lg font-medium">
              Create and launch new service offerings to your marketplace. Every detail counts toward professional excellence.
            </p>
            <div className="space-y-8">
              {[
                { icon: <FiZap />, title: "Instant Visibility", desc: "Live on marketplace immediately" },
                { icon: <span className="font-bold text-xl">₹</span>, title: "Smart Pricing", desc: "Dynamic rates for services" },
                { icon: <FiClock />, title: "Time Tracking", desc: "Optimized scheduling duration" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-2xl text-2xl">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-indigo-100/80 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-3 p-10">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Service Title</label>
                  <input
                    placeholder="e.g. Executive Office Cleaning"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 focus:bg-white bg-gray-50/50 outline-none transition-all text-lg font-bold"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Base Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="1499"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 focus:bg-white bg-gray-50/50 outline-none transition-all text-lg font-bold"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Duration (Min)</label>
                  <div className="relative">
                    <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      placeholder="120"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 focus:bg-white bg-gray-50/50 outline-none transition-all text-lg font-bold"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Description</label>
                  <textarea
                    rows="4"
                    placeholder="Explain the scope and value of this service..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 focus:bg-white bg-gray-50/50 outline-none transition-all text-lg font-medium resize-none"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 ${
                  loading ? "bg-indigo-300 cursor-not-allowed" : "bg-gray-900 hover:bg-indigo-600"
                }`}
              >
                {loading ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div> : <><FiActivity /> Publish Service</>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-r-transparent shadow-lg"></div>
              <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Syncing real-time data</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-40 flex flex-col items-center">
              <div className="bg-gray-50 p-8 rounded-full mb-6">
                <FiCalendar className="text-6xl text-gray-200" />
              </div>
              <p className="text-gray-400 text-xl font-black uppercase tracking-widest">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                    <th className="px-10 py-8">Customer</th>
                    <th className="px-10 py-8">Service Details</th>
                    <th className="px-10 py-8">Schedule</th>
                    <th className="px-10 py-8 text-center">Current Status</th>
                    <th className="px-10 py-8 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-100 h-12 w-12 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                            {b.userId?.name?.charAt(0) || <FiUser />}
                          </div>
                          <div>
                            <div className="font-black text-gray-900">{b.userId?.name || 'Unknown User'}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 font-medium"><FiMail /> {b.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-bold text-indigo-600">{b.serviceId?.name || 'Service Deleted'}</div>
                        <div className="text-sm font-black text-gray-900 mt-1">₹{b.serviceId?.price}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <FiCalendar className="text-indigo-400" />
                          {new Date(b.bookingDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-wider ml-6">
                          {new Date(b.bookingDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {b.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(b._id, 'accepted')}
                                title="Accept Booking"
                                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                              >
                                <FiCheckCircle className="text-xl" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(b._id, 'rejected')}
                                title="Reject Booking"
                                className="bg-red-100 text-red-600 p-3 rounded-xl hover:bg-red-200 transition-all"
                              >
                                <FiXCircle className="text-xl" />
                              </button>
                            </>
                          )}
                          {b.status === 'accepted' && (
                            <button 
                              onClick={() => handleStatusUpdate(b._id, 'completed')}
                              title="Complete Booking"
                              className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-green-700 transition-all shadow-lg shadow-green-100 uppercase tracking-widest"
                            >
                              Mark Completed
                            </button>
                          )}
                          {(b.status === 'completed' || b.status === 'rejected') && (
                            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-lg">Archived</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
