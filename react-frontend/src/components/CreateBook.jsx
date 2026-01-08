// react-frontend/src/components/CreateBook.jsx
import React, { useState } from 'react';
import api from '../api';
import {
  TextField, Button, Box, Typography, Snackbar, Alert
} from '@mui/material';

function CreateBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_date: '', // YYYY-MM-DD
    isbn: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert published_date to a Timestamp format if needed by the backend
      // For now, sending as string and hoping backend handles it.
      // If backend expects ISO 8601, adjust here: new Date(formData.published_date).toISOString()
      const payload = {
        ...formData,
        published_date: new Date(formData.published_date).toISOString().split('T')[0], // Convert to ISO 8601 string
      };
      await api.post('/books', payload);
      setSnackbar({ open: true, message: 'Book created successfully!', severity: 'success' });
      setFormData({ title: '', author: '', published_date: '', isbn: '' }); // Clear form
    } catch (err) {
      console.error('Error creating book:', err);
      setSnackbar({ open: true, message: `Error creating book: ${err.response?.data?.details || err.message}`, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, maxWidth: 500, mx: 'auto', p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Create New Book
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Author"
        name="author"
        value={formData.author}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Published Date"
        name="published_date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.published_date}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="ISBN"
        name="isbn"
        value={formData.isbn}
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
        Create Book
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateBook;
