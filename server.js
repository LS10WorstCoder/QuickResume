const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors'); // For handling CORS issues (optional)

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS if needed
app.use(cors());

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporarily store files in 'uploads/' directory

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Test route (optional)
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Read the uploaded file
    const fileContent = fs.readFileSync(req.file.path);

    // Set up S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
        Key: `uploads/${Date.now()}_${req.file.originalname}`, // Unique file name
        Body: fileContent,
    };

    // Upload file to S3
    s3.upload(params, (err, data) => {
        // Clean up the temporary file after upload
        fs.unlinkSync(req.file.path);

        if (err) {
            console.error('Error uploading to S3:', err);
            return res.status(500).json({ error: 'Error uploading file to S3.' });
        }

        // Respond with the file URL
        res.status(200).json({
            message: 'File uploaded successfully!',
            fileUrl: data.Location, // S3 file URL
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
