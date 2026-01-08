// react-frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const listBorrowings = () => api.get('/borrowings').then(res => res.data);
export const returnBorrowing = (borrowingId) => api.post(`/borrowings/${borrowingId}/return`).then(res => res.data);

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,

  // Book specific API calls
  getBooks: () => api.get('/books'),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),

  // Member specific API calls
  createMember: (memberData) => api.post('/members', memberData),
  getMemberById: (id) => api.get(`/members/${id}`),
  updateMember: (id, memberData) => api.put(`/members/${id}`, memberData),
  listMembers: () => api.get('/members'),

  // Borrow/Return specific API calls
  borrowBook: (borrowData) => api.post('/borrow', borrowData),
  // Removed old returnBook and listBorrowedBooks
  // listBorrowings and returnBorrowing are now named exports
};
