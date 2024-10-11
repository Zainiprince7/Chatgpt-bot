const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN'; // Apne Facebook app ka page access token se replace karein.

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'YOUR_VERIFY_TOKEN') { // Apne verify token se replace karein.
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
    } else {
        res.sendStatus(404);
    }
});

function handleMessage(sender_psid, message) {
    let response;

    if (message.text) {
        const userMessage = message.text.toLowerCase();

        if (userMessage.includes('hi') || userMessage.includes('hello')) {
            response = { "text": "Hello! 😊 How can I assist you today?" };
        } else if (userMessage.includes('bye')) {
            response = { "text": "Goodbye! 👋 Have a great day!" };
        } else {
            response = { "text": `You sent: "${message.text}"` };
        }
    }

    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
    request({
        uri: 'https://graph.facebook.com/v10.0/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender_psid },
            message: response
        }
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:' + response.error);
        }
    });
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
