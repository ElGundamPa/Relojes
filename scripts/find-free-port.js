const net = require('net');

function findFreePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findFreePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

findFreePort(3000).then(port => {
  console.log(port);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});


