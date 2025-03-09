import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

interface File {
  name: string;
  storage_url: string;
}

export const UploadedFiles: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch('https://gdrive-uploader-c6e1f491b041.herokuapp.com/files');
      const data = await response.json();
      setFiles(data);
    };
    fetchFiles();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Uploaded Files
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>File Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Storage URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell>{file.name}</TableCell>
                <TableCell>
                  <a
                    href={file.storage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.storage_url}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
