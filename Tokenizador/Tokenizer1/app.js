require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { encoding_for_model } = require('tiktoken');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT;


const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = fs.createWriteStream(path.join(logDirectory, `access-${port}.log`), { flags: 'a' });
app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms', {
    stream: accessLogStream,
    skip: (req, res) => res.statusCode < 400
}));

app.use(cors());

const enc = encoding_for_model('gpt-4');

app.use(express.json());
const axios = require('axios'); 


const registerInstance = async () => {
    try {
        const response = await axios.post(`http://${process.env.HOST}:${process.env.DISCOVERY_PORT}/register`, {
            instanceId: process.env.INSTANCE_ID,
            address: `http://${process.env.IP_INSTANCE}:${port}`
        });
        console.log(response.data.message);
    } catch (error) {
        console.error('Error registrando la instancia:', error.message);
    }
};

registerInstance();

app.use(morgan((tokens, req, res) => {
    const statusCode = tokens.status(req, res);
    const logData = {
        date: tokens.date(req, res, 'iso'),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: statusCode,
        responseTime: tokens['response-time'](req, res),
        contentLength: tokens.res(req, res, 'content-length'),
        payload: req.body || {},
        errorMessage: res.locals.errorMessage || 'Sin errores'
    };
    if (statusCode >= 400) {
        return `[ERROR] ${JSON.stringify(logData)}\n`;
    }

    return `[INFO] ${JSON.stringify(logData)}\n`;
}, {
    stream: accessLogStream
}));

app.post('/tokenize', (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.locals.errorMessage = 'El texto proporcionado es inválido o está vacío.';
        return res.status(400).json({ error: res.locals.errorMessage });
    }

    try {
        const tokens = enc.encode(text);
        const tokenCount = tokens.length;

        const result = {
            tokens: tokens,
            tokenCount: tokenCount
        };

        const logData = {
            date: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            payload: req.body,
            result: result
        };

        accessLogStream.write(`[INFO] ${JSON.stringify(logData)}\n`);

        res.json(result);
    } catch (error) {
        res.locals.errorMessage = `Error en la tokenización: ${error.message}`;
        const errorLog = {
            date: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            method: req.method,
            url: req.originalUrl,
            payload: req.body,
            status: res.statusCode
        };
        console.error(errorLog);
        accessLogStream.write(`[ERROR] ${JSON.stringify(errorLog)}\n`);
        
        res.status(500).json({ error: 'Ocurrió un error durante la tokenización.', details: error.message });
    }
});

app.get('/logs', (req, res) => {
    const logFilePath = path.join(logDirectory, `access-${port}.log`);

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading log file', details: err.message });
        }
        const logs = data.split('\n').filter(line => line.trim() !== ''); 
        res.json(logs);
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(port, () => {
    console.log(`Servidor de tokenización escuchando en http://localhost:${port}`);
});