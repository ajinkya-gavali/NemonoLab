// react-frontend/src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box } from '@mui/material';
import BookList from './components/BookList';
import CreateBook from './components/CreateBook';
import BorrowBook from './components/BorrowBook';
import UpdateBook from './components/UpdateBook';
import CreateMember from './components/CreateMember';
import UpdateMember from './components/UpdateMember';
import MemberList from './components/MemberList';
import BorrowingList from './components/BorrowingList'; // New import
import './App.css'; // Keep existing CSS if any

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            List Books
          </Button>
          <Button color="inherit" component={Link} to="/create-book">
            Create Book
          </Button>
          <Button color="inherit" component={Link} to="/borrow-book">
            Borrow Book
          </Button>
          <Button color="inherit" component={Link} to="/update-book">
            Update Book
          </Button>
          <Button color="inherit" component={Link} to="/create-member">
            Create Member
          </Button>
          <Button color="inherit" component={Link} to="/members">
            List Members
          </Button>
          <Button color="inherit" component={Link} to="/borrowings">
            List Borrowings {/* New Link */}
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/create-book" element={<CreateBook />} />
            <Route path="/borrow-book" element={<BorrowBook />} />
            <Route path="/update-book/:id" element={<UpdateBook />} />
            <Route path="/create-member" element={<CreateMember />} />
            <Route path="/update-member/:id" element={<UpdateMember />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/borrowings" element={<BorrowingList />} /> {/* New Route */}
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;