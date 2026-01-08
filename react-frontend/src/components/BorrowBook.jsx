// react-frontend/src/components/BorrowBook.jsx
import React, { useState } from 'react';
import api from '../api';
import {
  TextField, Button, Box, Typography, Snackbar, Alert
} from '@mui/material';

function BorrowBook() {
  const [formData, setFormData] = useState({
    book_id: '',
    member_id: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      <TextField
        fullWidth
        margin="normal"
        label="Book ID"
        name="book_id"
        value={formData.book_id}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Member ID"
        name="member_id"
        value={formData.member_id}
        onChange={handleChange}
        required
      />
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
