const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   res.render('test');
// });

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/test.html');
  });

  app.get('/download', (req, res) => {
	const url = req.query.url;
	res.header('Content-Disposition', 'attachment; filename="video.mp4"');
	ytdl(url, {
		quality: 'highestvideo'
	}).pipe(res);
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});



// Create a server object:
// const server = http.createServer(function (req, res) {

// 	// Write a response to the client
// 	res.write('Server Connected..!')

// 	// End the response
// 	res.end()
// })

// fs.readFile('../Frontend/index.html', function(error, html){
// 	if(error) throw error;
// 	http.createServer(function(req, res){
// 		res.write(200, {"content-type": "text/html"});
// 		res.write(html);
// 		request.end();

// 	}).listen(port)
// })


// const url = 'https://www.youtube.com/watch?v=l_ddxKWNZqI';
// const stream = ytdl(url, {
//   quality: 'highestaudio',
//   filter: 'audioonly'
// });

// stream.pipe(fs.createWriteStream('video.mp3'));

// stream.on('progress', (chunkLength, downloaded, total) => {
//   const percent = downloaded / total;
//   process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
//   process.stdout.cursorTo(0);
// });

// stream.on('end', () => {
//   console.log('Download complete.');
// });


// Set up our server so it will listen on the port
// server.listen(port, function (error) {

// 	// Checking any error occur while listening on port
// 	if (error) {
// 		console.log('Something went wrong', error);
// 	}
// 	// Else sent message of listening
// 	else {
// 		console.log('Server is listening on port ' + port);
// 	}
// })
