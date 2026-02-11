const API = import.meta.env.VITE_API_URL;

const handleResponse = async (res) => {
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with ${res.status}`);
  }
  return data;
};

export const signup = (data) =>
  fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getServices = (token) =>
  fetch(`${API}/services`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

export const createService = (data, token) =>
  fetch(`${API}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const createBooking = (data, token) =>
  fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getMyBookings = (token) =>
  fetch(`${API}/bookings/mybookings`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

export const getAllBookingsAdmin = (token) =>
  fetch(`${API}/bookings/allbookings`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

export const updateBookingStatus = (id, status, token) =>
  fetch(`${API}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }).then(handleResponse);
