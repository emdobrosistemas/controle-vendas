const pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.list((err, list) => {
    if (err) {
      console.error(err);
      pm2.disconnect();
      return;
    }

    const app = list.find(p => p.name === 'gestao-app');
    
    if (app) {
      // Restart if exists
      pm2.restart('gestao-app', (err) => {
        if (err) console.error(err);
        pm2.disconnect();
      });
    } else {
      // Start if doesn't exist
      pm2.start({
        script: 'server.js',
        name: 'gestao-app',
        env: {
          NODE_ENV: 'production'
        }
      }, (err) => {
        if (err) console.error(err);
        pm2.disconnect();
      });
    }
  });
}); 