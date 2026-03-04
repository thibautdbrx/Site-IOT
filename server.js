const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mqttClient = mqtt.connect('mqtt://100.64.177.74:1883');

mqttClient.on('connect', () => {
    console.log('Connecté à Mosquitto');
    mqttClient.subscribe('gyro_data');
});

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté au dashboard');

    socket.on('commande-lumiere', (etat) => {
        console.log("Envoi de l'ordre MQTT :", etat);


        mqttClient.publish('light', etat.toString());
    });
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