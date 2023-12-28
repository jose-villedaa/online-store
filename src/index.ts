require('dotenv').config();
const Server = require('./server').default;

const startedServer = new Server();
startedServer.listen();
