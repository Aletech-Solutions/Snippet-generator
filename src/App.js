import React, { useState, useRef, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Download,
  ContentCopy,
  Palette
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const gradientPresets = [
  { name: 'Sunset', colors: ['#ff9a9e', '#fad0c4'] },
  { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { name: 'Forest', colors: ['#134e5e', '#71b280'] },
  { name: 'Purple Rain', colors: ['#667eea', '#764ba2'] },
  { name: 'Orange Coral', colors: ['#ff9a9e', '#fecfef'] },
  { name: 'Blue Lagoon', colors: ['#43e97b', '#38f9d7'] },
];

function App() {
  const [code, setCode] = useState(`import ollama
from chromadb import Client

chroma = Client()
collection = chroma.create_collection("docs")

docs = [
    "Ollama lets you run models locally.",
    "RAG combines retrieval with generation."
]

for doc in docs:
    embedding = ollama.embed(model="mxbai-embed-large", input=doc)["embedding"]
    collection.add(documents=[doc], embeddings=[embedding])`);
  
  const [language, setLanguage] = useState('python');
  const [backgroundColor, setBackgroundColor] = useState('#2d3748');
  const [textColor, setTextColor] = useState('#e2e8f0');
  const [borderRadius, setBorderRadius] = useState(12);
  const [padding, setPadding] = useState(32);
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [windowStyle, setWindowStyle] = useState(true);
  const [exportSize, setExportSize] = useState(2);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const codeRef = useRef(null);
  const highlightedCode = useRef('');

  useEffect(() => {
    if (code && language) {
      try {
        const langKey = language === 'html' ? 'markup' : language;
        highlightedCode.current = Prism.highlight(code, Prism.languages[langKey] || Prism.languages.javascript, langKey);
      } catch (error) {
        console.error('Syntax highlighting error:', error);
        highlightedCode.current = code;
      }
    }
  }, [code, language]);

  const getBackgroundStyle = () => {
    if (gradientEnabled && gradientPresets[selectedGradient]) {
      const gradient = gradientPresets[selectedGradient];
      return {
        background: `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]})`
      };
    }
    return {
      backgroundColor: backgroundColor
    };
  };

  const exportAsPNG = async () => {
    if (!codeRef.current) return;

    try {
      const canvas = await html2canvas(codeRef.current, {
        backgroundColor: null,
        scale: exportSize,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `code-snippet-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setSnackbarMessage('Image exported successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Export error:', error);
      setSnackbarMessage('Error exporting image');
      setSnackbarOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setSnackbarMessage('Code copied to clipboard!');
      setSnackbarOpen(true);
    });
  };

  const renderLineNumbers = () => {
    if (!showLineNumbers) return null;
    
    const lines = code.split('\n');
    return (
      <Box
        sx={{
          pr: 2,
          borderRight: '1px solid rgba(255,255,255,0.1)',
          mr: 2,
          minWidth: '40px',
          textAlign: 'right',
          color: 'rgba(255,255,255,0.4)',
          userSelect: 'none',
          fontSize: fontSize * 0.9 + 'px',
          lineHeight: 1.5,
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }}
      >
        {lines.map((_, index) => (
          <div key={index + 1}>{index + 1}</div>
        ))}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          🎨 Code Snippet Generator
        </Typography>
        
        <Grid container spacing={4}>
          {/* Painel de Controle */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="java">Java</MenuItem>
                    <MenuItem value="css">CSS</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                    <MenuItem value="sql">SQL</MenuItem>
                    <MenuItem value="bash">Bash</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={gradientEnabled}
                    onChange={(e) => setGradientEnabled(e.target.checked)}
                  />
                }
                label="Use Gradient"
                sx={{ mb: 2 }}
              />

              {gradientEnabled ? (
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Gradient</InputLabel>
                    <Select
                      value={selectedGradient}
                      label="Gradient"
                      onChange={(e) => setSelectedGradient(e.target.value)}
                    >
                      {gradientPresets.map((preset, index) => (
                        <MenuItem key={index} value={index}>{preset.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Background Color</Typography>
                  <TextField
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    fullWidth
                  />
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Text Color</Typography>
                <TextField
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Font Size: {fontSize}px</Typography>
                <Slider
                  value={fontSize}
                  onChange={(e, value) => setFontSize(value)}
                  min={10}
                  max={24}
                  step={1}
                  marks
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Border Radius: {borderRadius}px</Typography>
                <Slider
                  value={borderRadius}
                  onChange={(e, value) => setBorderRadius(value)}
                  min={0}
                  max={30}
                  step={1}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Padding: {padding}px</Typography>
                <Slider
                  value={padding}
                  onChange={(e, value) => setPadding(value)}
                  min={16}
                  max={64}
                  step={4}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Export Quality: {exportSize}x</Typography>
                <Slider
                  value={exportSize}
                  onChange={(e, value) => setExportSize(value)}
                  min={1}
                  max={4}
                  step={0.5}
                  marks
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                  />
                }
                label="Show Line Numbers"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={windowStyle}
                    onChange={(e) => setWindowStyle(e.target.checked)}
                  />
                }
                label="Window Style"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={exportAsPNG}
                  fullWidth
                >
                  Export PNG
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={copyToClipboard}
                  sx={{ minWidth: 'auto' }}
                >
                  Copy
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Editor e Preview */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Code Editor
                  </Typography>
                  <TextField
                    multiline
                    rows={12}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="Paste your code here..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: '14px',
                      }
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Preview
                  </Typography>
                  <Box
                    ref={codeRef}
                    sx={{
                      ...getBackgroundStyle(),
                      borderRadius: borderRadius + 'px',
                      padding: padding + 'px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {windowStyle && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          pb: 2,
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27ca3f' }} />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                        >
                          {language}.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex' }}>
                      {renderLineNumbers()}
                      <Box
                        sx={{
                          flex: 1,
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                          fontSize: fontSize + 'px',
                          lineHeight: 1.5,
                          color: textColor,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          '& .token.comment': { color: '#6a9955' },
                          '& .token.string': { color: '#ce9178' },
                          '& .token.keyword': { color: '#569cd6' },
                          '& .token.function': { color: '#dcdcaa' },
                          '& .token.number': { color: '#b5cea8' },
                          '& .token.operator': { color: '#d4d4d4' },
                          '& .token.punctuation': { color: '#d4d4d4' },
                        }}
                        dangerouslySetInnerHTML={{ __html: highlightedCode.current }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
