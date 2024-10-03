require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

let instances = [];

app.use(cors());
app.use(express.json());

const instanceExists = (address) => {
    return instances.includes(address); 
};

app.post('/register', (req, res) => {
    const { address } = req.body;

    if (!address) { 
        return res.status(400).json({ error: 'Falta la dirección de la instancia' });
    }

    if (instanceExists(address)) {
        return res.status(409).json({ message: 'La instancia ya está registrada', instances });
    }

    instances.push(address);
    res.status(201).json({ message: 'Instancia registrada exitosamente', instances });
});

app.get('/instances', (req, res) => {
    res.json(instances);
});

setInterval(() => {
    console.log('Instancias:', instances); 
}, 60000);

app.listen(port, () => {
    console.log(`Discovery server escuchando en http://192.168.1.5:${port}`);
});
