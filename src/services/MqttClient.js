import { Client, Message } from 'paho-mqtt';

const broker = 'mqtt://192.168.1.55:1883/mqtt'; // WebSocket broker URL

class MqttClient {
  constructor() {
    this.client = new Client(broker, 'clientId-' + Math.random().toString(16).substr(2, 8));
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.isConnected = false; // Track connection state
    this.onMessageReceived = null; // Initialize onMessageReceived
  }

  setOnMessageReceived(handler) {
    this.onMessageReceived = handler;
  }

  connect() {
    if (this.isConnected) {
      return;
    }
    
    const options = {
      onSuccess: this.onConnect.bind(this),
      onFailure: this.onFailure.bind(this),
      userName: '',
      password: '',
      useSSL: false
    };
    this.client.connect(options);
  }

  onConnect() {
    console.log('Connected to MQTT broker');
    this.isConnected = true;
    this.client.subscribe('ABsensor/ec');         // Subscribe to EC sensor topic
    this.client.subscribe('ABsensor/ph');         // Subscribe to pH sensor topic
    this.client.subscribe('ABsensor/temperature'); // Subscribe to temperature sensor topic
  }

  onFailure(error) {
    console.error('Failed to connect:', error.errorMessage);
    this.isConnected = false; // Reset connection state on failure
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.error('Connection lost:', responseObject.errorMessage);
    }
    this.isConnected = false;
  }

  onMessageArrived(message) {
    console.log('Message arrived:', message.payloadString);
    if (this.onMessageReceived) {
      this.onMessageReceived(message.destinationName, message.payloadString); // Notify the component
    }
  }

  publish(topic, message) {
    if (this.isConnected) {
      const mqttMessage = new Message(message);
      mqttMessage.destinationName = topic;
      this.client.send(mqttMessage);
    } else {
      console.error('Cannot publish, MQTT client is not connected');
    }
  }

  disconnect() {
    if (this.isConnected) {
      this.client.disconnect();
      console.log('Disconnected from MQTT broker');
      this.isConnected = false;
    } else {
      console.warn('Cannot disconnect, MQTT client is not connected');
    }
  }
}

export default new MqttClient();
