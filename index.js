const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Helper Functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const processFile = (fileBase64) => {
    try {
        const fileData = Buffer.from(fileBase64, 'base64').toString('utf-8');
        return {
            file_valid: true,
            file_mime_type: "text/plain", // Simplified for demonstration
            file_size_kb: (fileData.length / 1024).toFixed(2),
        };
    } catch (err) {
        return { file_valid: false };
    }
};

// Routes
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid input" });
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;
    let primeFound = false;

    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
            if (isPrime(parseInt(item))) primeFound = true;
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (item === item.toLowerCase() && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    const fileInfo = processFile(file_b64 || "");

    res.status(200).json({
        is_success: true,
        user_id: "atharvraj_singh_rana_21112001",
        email: "atharvraj@svvv.edu.in",
        roll_number: "ABCD123",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: primeFound,
        file_valid: fileInfo.file_valid,
        file_mime_type: fileInfo.file_mime_type || null,
        file_size_kb: fileInfo.file_size_kb || null,
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
