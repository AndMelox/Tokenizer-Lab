require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.MIDDLEWARE_PORT;
const discoveryUrl = `http://${process.env.DISCOVERY_HOST}:${process.env.DISCOVERY_PORT}/instances`;

let servers = [];
let serverStats = servers.map(server => ({ url: server, requests: 0 }));

app.use(cors());
app.use(express.json());

const getLeastConnectedServer = () => {
    return serverStats.reduce((prev, curr) => (prev.requests < curr.requests ? prev : curr));
};

const resetServerStats = () => {
    serverStats.forEach(server => {
        server.requests = 0;
    });
};

const updateServerList = async () => {
    try {
        const response = await axios.get(discoveryUrl);
        console.log('Response from discovery service:', response.data);

        const newServers = response.data.filter(server => !servers.includes(server));
        
        servers = [...servers, ...newServers]; 
        
        const existingServerStats = serverStats.filter(stat => servers.includes(stat.url));
        const newServerStats = newServers.map(server => ({ url: server, requests: 0 }));
        serverStats = [...existingServerStats, ...newServerStats];

        console.log('Server list updated:', servers);
    } catch (error) {
        console.error('Error fetching server list from discovery service:', error.message);
    }
};

setInterval(updateServerList, 10000);

setInterval(resetServerStats, 300000);

updateServerList(); 

app.post('/tokenize', async (req, res) => {
    let attempts = 0;
    let success = false;
    let response;

    while (attempts < serverStats.length && !success) {
        const server = getLeastConnectedServer();

        try {
            response = await axios.post(`${server.url}/tokenize`, req.body);
            server.requests += 1;
            success = true;
        } catch (error) {
            console.error(`Error with server ${server.url}:`, error.message);
            server.failed = true;
        }

        attempts += 1;
    }

    if (success) {
        res.json(response.data);
    } else {
        res.status(500).json({ error: 'All servers are down' });
    }
});

app.get('/monitor', (req, res) => {
    res.json(serverStats);
});

app.get('/logs', async (req, res) => {
    try {
        const logPromises = servers.map(async (server) => {
            try {
                const response = await axios.get(`${server}/logs`);
                return { server: server, logs: response.data };
            } catch (error) {
                return { server: server, logs: [], error: error.message };
            }
        });

        const logs = await Promise.all(logPromises);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching logs from instances', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Middleware listening on http://10.4.75.62:${port}`);
});