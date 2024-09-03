const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const mime = require('mime');

const app = express();
const upload = multer({
    dest: config.uploadDir,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
        }
    }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded. Please select a file to upload.' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, fileUrl: fileUrl });
});

app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(config.uploadDir, req.params.filename);
    const mimeType = mime.getType(filePath);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ success: false, message: 'File not found. Please check the file URL and try again.' });
        }
    });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
    } else if (err) {
        res.status(400).json({ success: false, message: `Error: ${err.message}` });
    }
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    if (!fs.existsSync(config.uploadDir)) {
        fs.mkdirSync(config.uploadDir);
    }
});
