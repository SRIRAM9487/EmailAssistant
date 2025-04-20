import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });

      setGeneratedReply(
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      );
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedReply], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'generated-reply.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Email Reply Generator
        </Typography>

        <Box sx={{ mt: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="concise">Concise</MenuItem>
              <MenuItem value="empathetic">Empathetic</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="informal">Informal</MenuItem>
              <MenuItem value="apologetic">Apologetic</MenuItem>
              <MenuItem value="assertive">Assertive</MenuItem>
              <MenuItem value="encouraging">Encouraging</MenuItem>
              <MenuItem value="respectful">Respectful</MenuItem>
              <MenuItem value="optimistic">Optimistic</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            sx={{ py: 1.5, fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>

        <Paper elevation={2} sx={{ mt: 5, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply}
            inputProps={{ readOnly: true }}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigator.clipboard.writeText(generatedReply)}
              disabled={!generatedReply}
            >
              Copy to Clipboard
            </Button>

            <Button
              variant="outlined"
              onClick={handleDownload}
              disabled={!generatedReply}
            >
              Download as .txt
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{ mt: 5, p: 3, border: '2px dashed #90caf9', borderRadius: 2, textAlign: 'center' }}
        >
          <Typography variant="h5" gutterBottom>
            Browser Extension
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Install our Chrome extension to generate replies directly from your inbox.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            href="../EmailAssistantExtension.zip"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 4, py: 1.2 }}
            type='download'
          >
            Download Extension
          </Button>
        </Paper>
      </Paper>
    </Container>
  );
}

export default App;
