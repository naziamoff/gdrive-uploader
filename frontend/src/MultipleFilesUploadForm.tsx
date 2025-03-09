import React, { useState, FormEvent } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';

interface FileFormData {
  name: string;
  url: string;
}

interface QueryResult {
  name: string;
  url: string;
  storage_url: string;
}

export const MultipleFilesUploadForm: React.FC = () => {
  const [files, setFiles] = useState<FileFormData[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<QueryResult[]>([]);

  const addFile = () => {
    if (fileName && fileUrl) {
      setFiles([...files, { name: fileName, url: fileUrl }]);
      setFileName('');
      setFileUrl('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('Please add at least one file.');
      return;
    }

    setIsUploading(true);

    try {
      console.log(125);

      const response = await fetch(`http://localhost/api/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(files),
      });

      setIsUploading(false);

      if (response.ok) {
        const data = await response.json();
        const storageUrls = data.map((file: QueryResult) => file.storage_url);

        setUploadedFiles([...uploadedFiles, ...data]);

        setFiles([]);
      } else {
        alert('Error uploading files');
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Error uploading files');
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ margin: 'auto', padding: 3, maxWidth: '800px' }}>
      <Typography variant="h5" gutterBottom>
        Upload Files to GDrive
      </Typography>

      <Divider sx={{ marginBottom: 2 }} />

      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <TextField
          label="File Name"
          variant="outlined"
          fullWidth
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="File URL"
          variant="outlined"
          fullWidth
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#40836c',
            color: '#fff',
            height: 50,
            '&:hover': {
              backgroundColor: '#336f57',
            },
          }}
          onClick={addFile}
          disabled={!fileName || !fileUrl}
        >
          Add File
        </Button>
      </Box>

      {/* Display List of Files */}
      {files.length > 0 && (
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>File Name</b>
                </TableCell>
                <TableCell>
                  <b>URL</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => removeFile(index)}
                      aria-label="remove file"
                    >
                      x
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {files.length > 0 && (
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#40836c',
              color: '#fff',
              height: 50,
              width: '100%',
              '&:hover': {
                backgroundColor: '#336f57',
              },
            }}
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upload All Files'
            )}
          </Button>
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
            Recently uploaded files
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>File Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Storage URL</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedFiles.map((file, index) => (
                  <TableRow key={index}>
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
        </>
      )}
    </Box>
  );
};
