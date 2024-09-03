const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');

try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
} catch (error) {
    console.error(`Error creating upload directory: ${error.message}`);
    process.exit(1);
}

module.exports = {
    port: 3000,
    uploadDir: uploadDir
};
