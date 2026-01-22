const API = "http://localhost:4000/api";

export const signup = (data) =>
  fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const getServices = (token) =>
  fetch(`${API}/services`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());

export const createService = (data, token) =>
  fetch(`${API}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const createBooking = (data, token) =>
  fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const getMyBookings = (token) =>
  fetch(`${API}/bookings/Mybookings`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());

export const getAllBookingsAdmin = (token) =>
  fetch(`${API}/bookings/allbookings`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.json());

export const updateBookingStatus = (id, status, token) =>
  fetch(`${API}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  }).then(res => res.json());
