const events = require("events");
const EVENTS = new events();
const clientClass = require("./utils/Client");
const client = new clientClass(__dirname, EVENTS);
client.launch();
