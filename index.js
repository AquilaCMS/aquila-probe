const path = require('path');
const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const { expressErrorHandler } = require('./middleware');
const { resolve } = require('path');

global.apiDir = resolve(__dirname);

const PORT = process.env.PORT || 3050;
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    }),
);
app.use('/api', routes, expressErrorHandler);
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
});

app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`server listening on port ${PORT}`);
});
