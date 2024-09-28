require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log('hello world');
    next();
});





const authController = require('./controllers/auth');

// Routes
app.post('/login', authController.login);
app.post('/register', authController.register);






const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
