const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN'; // Isse apne Facebook app ka page access token se replace karein.

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'YOUR_VERIFY_TOKEN') { // Isse apne verify token se replace karein.
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
