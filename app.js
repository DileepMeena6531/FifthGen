const express = require('express');
const net = require('net');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/devices/read', async (req, res) => {

    const { ip, port, message } = req.body;

    try {
        const response = await sendTcpData(ip, port, message);
        res.json(response);
    } catch (error) {
        console.error('Error communicating with device:', error);
        res.status(500).json({ error: error.message });
    }
});

const sendTcpData = (ip, port, data) => {
    return new Promise((resolve, reject) => {
        if (!ip || !port || !data) {
            return reject(new Error('IP address, port number, and message are required.'));
        }

        port = Number(port);
        if (isNaN(port)) {
            return reject(new Error('Port number must be a valid number.'));
        }

        const client = new net.Socket();
        let response = '';

        client.connect(port, ip, () => {
            client.write(data);
        });

        client.on('data', (chunk) => {
            response += chunk.toString();
        });

        client.on('end', () => {
            resolve({ response });
        });

        client.on('error', (err) => {
            reject(err);
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
    });
};

const server = app.listen(8080, () => {
    console.log("Server running on port 8080");
});

module.exports = { app, server };
