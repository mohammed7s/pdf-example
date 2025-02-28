// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate PDF endpoint
app.post('/generate-pdf', (req, res) => {
  const { name, age, address, nationality } = req.body;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add content to PDF
  doc.setFontSize(22);
  doc.text('Personal Information', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(`Name: ${name || 'N/A'}`, 20, 40);
  doc.text(`Age: ${age || 'N/A'}`, 20, 50);
  doc.text(`Address: ${address || 'N/A'}`, 20, 60);
  doc.text(`Nationality: ${nationality || 'N/A'}`, 20, 70);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 90);
  
  // Save the PDF to a file in the public directory
  const pdfPath = path.join(__dirname, 'public', 'information.pdf');
  fs.writeFileSync(pdfPath, Buffer.from(doc.output('arraybuffer')));
  
  // Send success response
  res.json({ success: true, file: '/information.pdf' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});