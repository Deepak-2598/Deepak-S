const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

app.get('/download', (req, res) => {
  const videoURL = req.query.url;
  const downloadType = req.query.type;
  const quality = req.query.quality;
  const video = ytdl(videoURL, { quality: quality });
  const audio = ytdl(videoURL, { filter: 'audioonly' });

  if (downloadType === 'video') {
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    video.pipe(res);
  } else if (downloadType === 'audio') {
    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    audio.pipe(res);
  } else if (downloadType === 'both') {
    const outputFileName = 'output.mp4';
    const videoStream = video.pipe(fs.createWriteStream('video.mp4'));
    const audioStream = audio.pipe(fs.createWriteStream('audio.mp3'));

    videoStream.on('finish', () => {
      audioStream.on('finish', () => {
        ffmpeg()
          .input('video.mp4')
          .input('audio.mp3')
          .outputOptions('-c copy')
          .on('error', (err) => {
            console.log(`Error: ${err.message}`);
          })
          .on('end', () => {
            res.header('Content-Disposition', `attachment; filename="${outputFileName}"`);
            res.download(outputFileName, () => {
              fs.unlink('video.mp4', () => {});
              fs.unlink('audio.mp3', () => {});
              fs.unlink(outputFileName, () => {});
            });
          })
          .save(outputFileName);
      });
    });
  } else {
    res.send('Invalid download type');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
