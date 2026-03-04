const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mqttClient = mqtt.connect('mqtt://100.64.177.74:1880');

mqttClient.on('connect', () => {
    console.log('Connecté à Mosquitto');
    mqttClient.subscribe('gyro_data');
});

mqttClient.on('message', (topic, message) => {
    const data = message.toString();
    console.log(`Donnée reçue sur ${topic}: ${data}`);

    // On envoie la donnée en temps réel au navigateur
    io.emit('donnee-iot', { val: data, date: new Date().toLocaleTimeString() });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Serveur lancé sur http://100.64.177.74:3000');
});