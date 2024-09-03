const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('./config');

const app = express();
const upload = multer({ dest: config.uploadDir });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
    res.json({ success: true, fileUrl: fileUrl });
});

app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(config.uploadDir, req.params.filename);
    res.sendFile(filePath);
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
