const fs = require("fs");
var request = require("request");;
const gm = require('gm');
var wrap = require('word-wrap');
const express = require('express');

//https://www.raspberrypi.org/documentation/linux/usage/cron.md

//https://quoteimg.glitch.me/generate?height=1080&width=1080
//https://api.quotable.io/random?maxLength=100
//https://picsum.photos/1000/1000


var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createPic(){
  download('https://picsum.photos/' + resolution[0] + '/' + resolution[1], 'inspiration.jpg', function () {
    gm('inspiration.jpg')
        .region(resolution[0], resolution[1], 0, 0)
        .gravity('Center')
        .fill('#3a3a3a')
        .stroke('#ffffff', 2)
        .font(fonts[getRandomInt(4)], 70)
        .drawText(0, -100, wrap(quote, {
            width: 25
        }))
        .write('inspiration.jpg', err => {
            if (err) return console.error(err);
            console.log("Done");
        });
  });
}

const app = express();

var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay) + 1;

var quotes = JSON.parse(fs.readFileSync('Quotes.json'))["quotes"];
var quote = quotes[day % quotes.length];

var resolution = [1000, 1000];
let fonts = ['Arial', 'Verdana', 'Arial Black', 'Impact'];


const PORT = 3000;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.json({
    "messages": [
      {
        "attachment": {
          "type": "image",
          "payload": {
            "url": "http://wsb.onthewifi.com:3000/image.jpg"
          }
        }
      }
    ]
  });
});

app.get('/create', (req, res) => {
  createPic();
  res.json({
    "messages": [
      {"text": "Let's go 🎉"}
    ]
   });
});

app.get('/image.jpg', (req, res) => {
  var type = 'image/jpeg';
  var s = fs.createReadStream(__dirname + '/inspiration.jpg');

  s.on('open', function () {
      res.setHeader('Content-Type', type);
      s.pipe(res);
  });
  s.on('error', function () {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found');
  });
});

app.listen(PORT, HOST);
console.log("Running on http://0.0.0.0:3000");
