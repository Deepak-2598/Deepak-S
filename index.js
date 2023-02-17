const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/test.html');
});

app.get('/download', async (req, res, next) => {
    try {
        const url = req.query.url;
        const format = req.query.format;
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'video');
        const formatMap = {};
        for (let i = 0; i < formats.length; i++) {
            const format = formats[i];
            const quality = format.qualityLabel || format.resolution + 'p';
            formatMap[quality] = format;
        }
        if (!formatMap[format]) {
            throw new Error(`No such format found: ${format}`);
        }
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        ytdl(url, {
            format: formatMap[format]
        }).pipe(res);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
