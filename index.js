const express = require('express'); //include express
const jwt = require('jsonwebtoken'); //include JWT token library
const app = express(); //initialize express server

app.get('/api', (req, res) => {
    res.json({
        text: "My api"
    });
});

app.post('/api/login', (req, res) => {
    //auth user
    const user = {
        id: 5,
        username: 'Prashant'
    }
    //sign the token
    const token = jwt.sign({ user }, 'my_secret_key', { expiresIn: '1d' }, (err, token) => {
        res.json({ token }); // sending token in response

    });
});

// Access protected data using token
app.get('/api/protected', ensureToken, (req, res) => {
    // verify the token using secret key
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (err) {
            res.sendStatus(403); //Forbidden
        } else {
            //sending protected data as response, if token is verified
            res.json({
                text: "This is protected data",
                data
            });
        }
    });
});


function ensureToken(req, res, next) {
    // access the authorization header
    const bearerHeader = req.headers['authorization'];
    //confirming that the header must not be undefined type
    if (typeof bearerHeader != 'undefined') {
        // spilit the bearerHeader data at space & assign that into bearer variable
        const bearer = bearerHeader.split(' ');
        // extract Token from the bearer which is at index 1 of the array
        const bearerToken = bearer[1];
        // store the token into req.token
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403); //Forbidden; if bearerHeader is undefined
    }
}

app.listen(3000, () => {
    console.log('Server started on port 3000');
})