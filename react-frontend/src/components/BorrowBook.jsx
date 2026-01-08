// react-frontend/src/components/BorrowBook.jsx
import React, { useState, useEffect } from 'react';
import api, { listMembers, listAvailableBooks } from '../api';
import {
  TextField, Button, Box, Typography, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

function BorrowBook() {
  const [formData, setFormData] = useState({
    book_id: '',
    member_id: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // New state for dropdown data
  const [members, setMembers] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [errorMembers, setErrorMembers] = useState(null);
  const [errorBooks, setErrorBooks] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch members and available books on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      // Fetch members
      try {
        setLoadingMembers(true);
        const membersData = await listMembers();
        // Ensure membersData is an array, default to empty array if undefined/null
        setMembers(membersData || []);
        setErrorMembers(null);
      } catch (err) {
        setErrorMembers('Failed to load members.');
        console.error('Error fetching members:', err);
      } finally {
        setLoadingMembers(false);
      }

      // Fetch available books
      try {
        setLoadingBooks(true);
        const booksData = await listAvailableBooks();
        setAvailableBooks(booksData || []); // Ensure availableBooks is always an array
        setErrorBooks(null);
      } catch (err) {
        setErrorBooks('Failed to load available books.');
        console.error('Error fetching available books:', err);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchDropdownData();
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/borrow', formData);
      setSnackbar({ open: true, message: 'Book borrowed successfully!', severity: 'success' });
      setFormData({ book_id: '', member_id: '' }); // Clear form
    } catch (err) {
      console.error('Error borrowing book:', err);
      setSnackbar({ open: true, message: `Error borrowing book: ${err.response?.data?.details || err.message}`, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, maxWidth: 500, mx: 'auto', p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Borrow Book
      </Typography>
      {/* Book Dropdown */}
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="book-select-label">Book</InputLabel>
        <Select
          labelId="book-select-label"
          id="book_id"
          name="book_id"
          value={formData.book_id}
          label="Book"
          onChange={handleChange}
          disabled={loadingBooks || !!errorBooks}
        >
          {loadingBooks && <MenuItem value="">Loading books...</MenuItem>}
          {errorBooks && <MenuItem value="">Error loading books</MenuItem>}
          {!loadingBooks && !errorBooks && availableBooks.length === 0 && (
            <MenuItem value="">No available books</MenuItem>
          )}
          {availableBooks.map((book) => (
            <MenuItem key={book.id} value={book.id}>
              {book.title} by {book.author}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Member Dropdown */}
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="member-select-label">Member</InputLabel>
        <Select
          labelId="member-select-label"
          id="member_id"
          name="member_id"
          value={formData.member_id}
          label="Member"
          onChange={handleChange}
          disabled={loadingMembers || !!errorMembers}
        >
          {loadingMembers && <MenuItem value="">Loading members...</MenuItem>}
          {errorMembers && <MenuItem value="">Error loading members</MenuItem>}
          {!loadingMembers && !errorMembers && members !== undefined &&members.length === 0 && (
            <MenuItem value="">No members found</MenuItem>
          )}
          {members.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.name} ({member.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Borrow Book
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BorrowBook;
