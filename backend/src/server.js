require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`HEALHUB API listening on :${PORT} (${process.env.NODE_ENV || 'development'})`));
