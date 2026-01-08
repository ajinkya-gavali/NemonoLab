import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Container, Box, Typography, CircularProgress, Alert
} from '@mui/material';
import api from '../api';

const CreateMember = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitSuccess(false);
    try {
      await api.createMember(member);
      setSubmitSuccess(true);
      setMember({ name: '', email: '' }); // Clear form
      setTimeout(() => {
        // navigate to member list or show a success message
        // For now, let's just clear the success message
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Member
        </Typography>
        {submitSuccess && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Member created successfully!</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>Error: {error.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Member Name"
            name="name"
            value={member.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={member.email}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Member'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateMember;