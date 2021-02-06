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
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}  


var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay) + 1;

var quotes = JSON.parse(fs.readFileSync('Quotes.json'))["quotes"];
var quote = quotes[day % quotes.length];

var resolution = [1000, 1000];
let fonts = ['Arial', 'Verdana', 'Arial Black', 'Impact'];


const PORT = 80;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
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
                res.sendFile(__dirname + '/inspiration.jpg');
            });
    });
});

app.listen(PORT, HOST);
console.log("Running on http://0.0.0.0:80");