require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema
const diagnosticEntrySchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  vehicleId: { type: String, required: true },
  logLevel: { type: String, enum: ['error', 'warn', 'info', 'debug'], required: true },
  errorCode: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true }
});

const DiagnosticEntry = mongoose.model('DiagnosticEntry', diagnosticEntrySchema);

// Routes
app.post('/api/diagnostics/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const content = req.file.buffer.toString();
    const entries = parseLogContent(content);
    const savedEntries = await DiagnosticEntry.insertMany(entries);
    
    res.status(201).json(savedEntries);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

app.get('/api/diagnostics', async (req, res) => {
  try {
     const filters = {
      ...(req.query.vehicleId && { vehicleId: req.query.vehicleId }),
      ...(req.query.logLevel && { logLevel: req.query.logLevel }),
      ...(req.query.errorCode && { errorCode: req.query.errorCode }),
      ...(req.query.severity && { severity: req.query.severity }),
      ...(req.query.fromDate && { timestamp: { $gte: new Date(req.query.fromDate) } }),
      ...(req.query.toDate && { timestamp: { $lte: new Date(req.query.toDate) } })
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      DiagnosticEntry.find(filters).skip(skip).limit(limit).sort({ timestamp: -1 }),
      DiagnosticEntry.countDocuments(filters)
    ]);

    res.json({
      data: entries,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    res.status(500).json({ error: 'Failed to fetch diagnostics' });
  }
});

// Helper function to parse log content
function parseLogContent(content) {
  return content.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const regex = /^\[(.*?)\] \[VEHICLE_ID:(\d+)\] \[(.*?)\] \[CODE:(.*?)\] \[(.*?)\]$/;
      const match = line.match(regex);
      
      if (!match) {
        console.warn('Skipping malformed log line:', line);
        return null;
      }

      // Map log level to severity
      const level = match[3].toLowerCase();
      let severity = 'medium';
      if (level === 'error') severity = 'high';
      else if (level === 'warn') severity = 'medium';
      else if (level === 'info' || level === 'debug') severity = 'low';

      return {
        timestamp: new Date(match[1]),
        vehicleId: match[2],
        logLevel: level,
        errorCode: match[4],
        message: match[5],
        severity: severity
      };
    })
    .filter(entry => entry !== null);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});