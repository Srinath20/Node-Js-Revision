const fs = require('fs');

const m2 = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>My First Page from server</title></head>');
        res.write('<body>');
        res.write('<form action="/message" method="POST">');
        res.write('<input type = "text" NAME="message">');
        res.write('<button type = "submit">Send</button>');
        res.write('<h1>');
        res.write('Page 01 from server welcomes you!! :)');
        res.write('</h1></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('messages.txt', message, (err) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500; 
                  return  res.end('Error saving the message');
                } else {
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    return res.end();
                }
            });
        });
    }

    // Default response
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title>My First Page from server</title></head><body><h1>Page 02 from server welcomes you!! :)</h1></body></html>');
    res.end();
}

module.exports = m2;
