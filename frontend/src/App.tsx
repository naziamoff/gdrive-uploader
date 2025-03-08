import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { MultipleFilesUploadForm } from './MultipleFilesUploadForm';
import { UploadedFiles } from './UploadedFiles';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from '@mui/material';

export const App = () => {
  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: '#40836c' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            File Upload App
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#2f5f4d',
              },
            }}
          >
            Upload Files
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/uploaded"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#2f5f4d',
              },
            }}
          >
            Uploaded Files
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <Routes>
          <Route path="/" element={<MultipleFilesUploadForm />} />
          <Route path="/uploaded" element={<UploadedFiles />} />
        </Routes>
      </Box>
    </Router>
  );
};
