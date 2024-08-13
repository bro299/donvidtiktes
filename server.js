const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(express.json());

// Setup untuk melayani file statis dari direktori "public"
app.use(express.static('public'));

const API_KEY = process.env.RAPIDAPI_KEY;

app.post('/download', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios({
            method: 'GET',
            url: 'https://tiktok-downloader-no-watermark.p.rapidapi.com/video.php',
            params: { url },
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'tiktok-downloader-no-watermark.p.rapidapi.com'
            }
        });

        console.log('Full API response:', response.data);

        const videoUrl = response.data.data && response.data.data.play;
        const thumbnailUrl = response.data.data && response.data.data.cover;
        const title = response.data.data ? response.data.data.title : 'No Title'; // Default title if empty

        console.log('Extracted data:', { videoUrl, thumbnailUrl, title });

        if (videoUrl && thumbnailUrl) {
            res.json({ videoUrl, thumbnailUrl, title });
        } else {
            res.status(500).json({ error: 'Missing video information' });
        }
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Error downloading video' });
    }
});

// Tidak perlu lagi menggunakan proxy middleware karena frontend akan dilayani dari file statis

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
