const express = require('express');
const path = require('path');
const cors = require('cors');
const server = express();

const PORT = 4000;

server.use(cors({origin: 'http://localhost:3000'}));

server.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

server.use('/openvtuber', require('../server/routes/index.js'));

server.use('/openvtuber', express.static('../server/uploads/MMDs'));
server.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
