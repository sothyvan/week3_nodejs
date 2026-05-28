const express = require('express');

const app = express();

app.get('/', (req, res) => {
    return res.status(200).type('html').send(`
        <html>
            <head><title>Home</title></head>
            <body>
                <h1>Welcome to the Home Page</h1>
                <p>This is a simple Node.js server.</p>
            </body>
        </html>`
    );
});

app.get('/about', (req, res) => {
    return res.status(200).type('html').send(`
        <html>
            <head><title>About</title></head>
            <body>
                <p>About us: at CADT, we love node.js!</p>
            </body>
        </html>`
    );
});

app.get('/contact-us', (req, res) => {
    return res.status(200).type('html').send(`
        <html>
            <head><title>Contact</title></head>
            <body>
                <p>You can reach us vai email</p>
            </body>
        </html>`
    );
});

app.get('/products', (req, res) => {
    return res.status(200).type('html').send(`
        <html>
            <head><title>Products</title></head>
            <body>
                <p>Buy one get one</p>
            </body>
        </html>`
    );
});

app.get('/projects', (req, res) => {
    return res.status(200).type('html').send(`
        <html>
            <head><title>Projects</title></head>
            <body>
                <p>Here are our awesome projects</p>
            </body>
        </html>`
    );
});

app.use((req, res) => {
    return res.status(404).type('text/plain').send('404 Not Found');
});

app.listen(3000, () =>{
    console.log("Server is running at http://localhost:3000");
});
