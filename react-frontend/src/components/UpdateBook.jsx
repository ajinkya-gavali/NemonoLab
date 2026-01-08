import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Button, Container, Box, Typography, CircularProgress, Alert
} from '@mui/material';
import api from '../api';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    published_date: '',
    isbn: '',
    is_available: true, // Assuming default is true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.getBookById(id);
        const bookData = response.data;
        setBook({
          title: bookData.title,
          author: bookData.author,
          published_date: bookData.published_date.split('T')[0], // Format for date input
          isbn: bookData.isbn,
          is_available: bookData.is_available,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitSuccess(false);
    try {
      await api.updateBook(id, { ...book, id: parseInt(id) });
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/'); // Navigate back to book list after successful update
      }, 2000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !book.title) { // Show loading spinner only initially
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Book
        </Typography>
        {submitSuccess && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Book updated successfully!</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            value={book.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="author"
            label="Author"
            name="author"
            value={book.author}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="published_date"
            label="Published Date"
            name="published_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={book.published_date}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="isbn"
            label="ISBN"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
          />
          {/* is_available checkbox/switch can be added here if needed */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Book'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateBook;