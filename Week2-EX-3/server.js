// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const submissionsFile = path.join(__dirname, 'submissions.txt');

const app = express();

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Welcome to the Home Page');
});

app.get('/contact', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
        </form>
    `);
    return;
});

app.post('/contact', (req, res) => {
    // Implement form submission handling
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () =>{
        const formData = querystring.parse(body);
        const submission = `Name: ${formData.name}\n`;
        
        fs.appendFile(submissionsFile, submission, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error saving submission');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Submission saved!');
        });
    })
});

app.use((req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
