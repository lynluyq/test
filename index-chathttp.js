const express = require('express');
const app = express();
const http = require('http').Server(app);
//const fs = require('fs');
var messages = []

app.get('/chat', (req, res) => {
    console.log(messages)
    res.json(messages)
})
app.post('/send', (req, res) => {
    let cur = {
        from: req.query.name,
        to: req.query.to,
        message: req.query.message
    }
    console.log(req)
    messages.push(cur)
    res.json({ message: 'Message sent!', test: 'yes' });
})

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});

//module.exports = app => {}