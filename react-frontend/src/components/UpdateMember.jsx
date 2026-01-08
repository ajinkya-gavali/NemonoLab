import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Button, Container, Box, Typography, CircularProgress, Alert
} from '@mui/material';
import api from '../api';

const UpdateMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await api.getMemberById(id);
        const memberData = response.data;
        setMember({
          name: memberData.name,
          email: memberData.email,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

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
      await api.updateMember(id, { ...member, id: parseInt(id) });
      setSubmitSuccess(true);
      setTimeout(() => {
        // navigate to member list or show a success message
        setSubmitSuccess(false); // Clear success message after a delay
      }, 2000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !member.name) { // Show loading spinner only initially
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
          Update Member
        </Typography>
        {submitSuccess && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Member updated successfully!</Alert>}
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
            {loading ? <CircularProgress size={24} /> : 'Update Member'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateMember;