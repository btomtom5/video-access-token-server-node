require('dotenv').load();

const https = require('https');
const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const tokenGenerator = require('./src/token_generator');

// Create Express webapp
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
  const identity = request.query.identity || 'identity';
  const room = request.query.room;
  response.send(tokenGenerator(identity, room));
});

app.get('*', function(req, res) {
   res.redirect('https://' + req.headers.host + req.url);
});

// Create an http server and run it
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});

// Setup https server and run it
const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/twilio-access.animet-prod.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/twilio-access.animet-prod.com/privkey.pem')
};

const httpsServer = https.createServer(options, app);
const httpsPort = 3443;
httpsServer.listen(httpsPort, function(){
  console.log('Express server running https on *:' + httpsPort)
});
