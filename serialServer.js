const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
const PORT = 3005;

app.use(cors());

const serialPort = new SerialPort({
  path: 'COM1', // <- Update this to match your working COM port
  baudRate: 115200,
  autoOpen: true
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Initialize with empty/default values
let sensorData = {
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  value5: '',
  value6: '',
  value7: '',
  value8: ''
};

// Serial data handling
parser.on('data', (line) => {
  console.log('📡 Raw:', line);

  // Remove curly braces and trim
  const cleaned = line.replace(/[{}]/g, '').trim();
  const values = cleaned.split(',');

  if (values.length === 8) {
    sensorData = {
      value1: values[0],
      value2: values[1],
      value3: values[2],
      value4: values[3],
      value5: values[4],
      value6: values[5],
      value7: values[6],
      value8: values[7]
    };
    console.log('✅ Parsed data:', sensorData);
  } else {
    console.warn('⚠️ Unexpected data format:', values);
  }
});

// API to serve data
app.get('/data', (req, res) => {
  res.json(sensorData);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
